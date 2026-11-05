/** Domain types deliberately contain no browser APIs; a remote adapter can implement LearningRepository. */
export type Theme = 'light' | 'dark';
export type LanguagePreference = 'en' | 'zh';
export interface LearningRef { courseId: string; lessonId: string; anchor?: string }
export interface Note extends LearningRef { id: string; text: string; updatedAt: number }
export interface ReadingPosition extends LearningRef { scrollY: number; sectionOffset?: number; updatedAt: number }
export interface Bookmark extends LearningRef { updatedAt: number }
export interface Completion extends LearningRef { complete: boolean; updatedAt: number }
export interface QuizAttempt { id: string; courseId: string; chapterId: string; score: number; total: number; answers: Record<string, string[]>; updatedAt: number }
export interface LearningData { version: 1; bookmarks: Bookmark[]; notes: Note[]; completions: Completion[]; positions: ReadingPosition[]; attempts: QuizAttempt[]; preferences: { theme: Theme; locale?: LanguagePreference; updatedAt: number } }
export interface LearningRepository {
  read(): Promise<LearningData>;
  saveNote(note: Note): Promise<void>;
  deleteNote(id: string): Promise<void>;
  setBookmark(ref: LearningRef, bookmarked: boolean): Promise<void>;
  setCompletion(ref: LearningRef, complete: boolean): Promise<void>;
  savePosition(position: ReadingPosition): Promise<void>;
  addAttempt(attempt: QuizAttempt): Promise<void>;
  setTheme(theme: Theme): Promise<void>;
  setLocale(locale: LanguagePreference): Promise<void>;
  exportData(): Promise<string>;
  importData(json: string): Promise<void>;
  status(): string;
}
export const STORAGE_KEY = 'strength-study.learning.v1';
export function emptyData(): LearningData { return {version:1,bookmarks:[],notes:[],completions:[],positions:[],attempts:[],preferences:{theme:'light',updatedAt:0}}; }
const object = (x: unknown): x is Record<string, unknown> => !!x && typeof x === 'object' && !Array.isArray(x);
const id = (x: unknown): x is string => typeof x === 'string' && /^[a-zA-Z0-9_-]{1,160}$/.test(x);
const time = (x: unknown): x is number => typeof x === 'number' && Number.isFinite(x) && x >= 0;
function ref(x: unknown): x is LearningRef { return object(x) && id(x.courseId) && id(x.lessonId) && (x.anchor === undefined || id(x.anchor)); }
function list<T>(x: unknown, check: (v: unknown) => boolean, name: string): T[] { if(!Array.isArray(x)||x.length>50000||!x.every(check)) throw new Error(`Invalid ${name} in learning data.`); return x as T[]; }
/** Explicit v0 migration: early exports used the same fields with a schemaVersion discriminator. */
export function validateData(input: unknown): LearningData {
  if(!object(input)) throw new Error('Learning data must be a JSON object.');
  const x = input.schemaVersion === 0 && input.version === undefined ? {...input,version:1} : input;
  if(x.version !== 1) throw new Error('Unsupported learning-data version. Expected version 1.');
  const bookmarks = list<Bookmark>(x.bookmarks??[],n=>object(n)&&ref(n)&&time(n.updatedAt),'bookmarks');
  const notes = list<Note>(x.notes,n=>object(n)&&ref(n)&&id(n.id)&&typeof n.text==='string'&&n.text.length<=100000&&time(n.updatedAt),'notes');
  const completions = list<Completion>(x.completions,n=>object(n)&&ref(n)&&typeof n.complete==='boolean'&&time(n.updatedAt),'completions');
  const positions = list<ReadingPosition>(x.positions,n=>object(n)&&ref(n)&&time(n.scrollY)&&(n.sectionOffset===undefined||time(n.sectionOffset))&&time(n.updatedAt),'positions');
  const attempts = list<QuizAttempt>(x.attempts,n=>object(n)&&id(n.id)&&id(n.courseId)&&id(n.chapterId)&&time(n.updatedAt)&&Number.isInteger(n.score)&&Number.isInteger(n.total)&&Number(n.score)>=0&&Number(n.total)>0&&Number(n.score)<=Number(n.total)&&object(n.answers)&&Object.entries(n.answers).every(([k,v])=>id(k)&&Array.isArray(v)&&v.every(id)),'attempts');
  if(!object(x.preferences)||!['light','dark'].includes(String(x.preferences.theme))||!time(x.preferences.updatedAt)||(x.preferences.locale!==undefined&&!['en','zh'].includes(String(x.preferences.locale)))) throw new Error('Invalid preferences.');
  // Keep only domain fields. Imported metadata and prototype keys never enter storage.
  const cleanRef=(n:LearningRef)=>({courseId:n.courseId,lessonId:n.lessonId,...(n.anchor?{anchor:n.anchor}:{})});
  return {version:1,bookmarks:bookmarks.map(n=>({...cleanRef(n),updatedAt:n.updatedAt})),notes:notes.map(n=>({...cleanRef(n),id:n.id,text:n.text,updatedAt:n.updatedAt})),completions:completions.map(n=>({...cleanRef(n),complete:n.complete,updatedAt:n.updatedAt})),positions:positions.map(n=>({...cleanRef(n),scrollY:n.scrollY,...(n.sectionOffset===undefined?{}:{sectionOffset:n.sectionOffset}),updatedAt:n.updatedAt})),attempts:attempts.map(n=>({id:n.id,courseId:n.courseId,chapterId:n.chapterId,score:n.score,total:n.total,answers:Object.fromEntries(Object.entries(n.answers).map(([k,v])=>[k,[...v]])),updatedAt:n.updatedAt})),preferences:{theme:x.preferences.theme as Theme,...(x.preferences.locale?{locale:x.preferences.locale as LanguagePreference}:{}),updatedAt:x.preferences.updatedAt}};
}
function mergeBy<T extends {updatedAt:number}>(a:T[],b:T[],key:(v:T)=>string):T[]{const result=new Map(a.map(v=>[key(v),v]));for(const v of b){const prior=result.get(key(v));if(!prior||v.updatedAt>prior.updatedAt)result.set(key(v),v);}return [...result.values()];}
const refKey=(x:LearningRef)=>`${x.courseId}/${x.lessonId}`;
const sectionKey=(x:LearningRef)=>`${refKey(x)}#${x.anchor||''}`;
/** Merge by stable ID/reference; newer timestamp wins, existing data wins ties. No deletion is inferred. */
export function mergeData(a:LearningData,b:LearningData):LearningData {return {version:1,bookmarks:mergeBy<Bookmark>(a.bookmarks??[],b.bookmarks??[],sectionKey),notes:mergeBy(a.notes,b.notes,n=>n.id),completions:mergeBy<Completion>(a.completions,b.completions,refKey),positions:mergeBy<ReadingPosition>(a.positions,b.positions,refKey),attempts:mergeBy(a.attempts,b.attempts,n=>n.id),preferences:b.preferences.updatedAt>a.preferences.updatedAt?{...b.preferences,...(b.preferences.locale===undefined&&a.preferences.locale?{locale:a.preferences.locale}:{})}:a.preferences};}
interface StoragePort { getItem(key:string):string|null; setItem(key:string,value:string):void }
export class LocalLearningRepository implements LearningRepository {
  private data: LearningData | undefined;
  private message = 'Stored on this browser/device only. Not automatically synchronized.';
  constructor(private storage:()=>StoragePort=()=>window.localStorage){}
  status(){return this.message;}
  private load(){if(this.data)return this.data;this.data=emptyData();try{const raw=this.storage().getItem(STORAGE_KEY);if(raw)this.data=validateData(JSON.parse(raw));}catch{this.message='Saved data could not be read. Changes are kept in memory; export a backup before leaving.';}return this.data;}
  private persist(data:LearningData){this.data=data;try{this.storage().setItem(STORAGE_KEY,JSON.stringify(data));this.message='Stored on this browser/device only. Not automatically synchronized.';}catch{this.message='Browser storage is unavailable or full. Changes are kept in memory; export a backup before leaving.';}}
  async read(){return structuredClone(this.load());}
  async saveNote(note:Note){const d=this.load();const checked=validateData({...emptyData(),notes:[note]}).notes[0];this.persist({...d,notes:[...d.notes.filter(n=>n.id!==checked.id),checked]});}
  async deleteNote(noteId:string){const d=this.load();this.persist({...d,notes:d.notes.filter(n=>n.id!==noteId)});}
  async setBookmark(r:LearningRef,bookmarked:boolean){const d=this.load();const n={...r,updatedAt:Date.now()};validateData({...emptyData(),bookmarks:[n]});this.persist({...d,bookmarks:[...d.bookmarks.filter(v=>sectionKey(v)!==sectionKey(r)),...(bookmarked?[n]:[])]});}
  async setCompletion(r:LearningRef,complete:boolean){const d=this.load();const n={...r,complete,updatedAt:Date.now()};validateData({...emptyData(),completions:[n]});this.persist({...d,completions:[...d.completions.filter(v=>refKey(v)!==refKey(r)),n]});}
  async savePosition(position:ReadingPosition){const d=this.load();validateData({...emptyData(),positions:[position]});this.persist({...d,positions:[...d.positions.filter(v=>refKey(v)!==refKey(position)),position]});}
  async addAttempt(attempt:QuizAttempt){const d=this.load();validateData({...emptyData(),attempts:[attempt]});this.persist({...d,attempts:[...d.attempts.filter(v=>v.id!==attempt.id),attempt]});}
  async setTheme(theme:Theme){if(theme!=='light'&&theme!=='dark')throw new Error('Invalid theme');this.persist({...this.load(),preferences:{...this.load().preferences,theme,updatedAt:Date.now()}});}
  async setLocale(locale:LanguagePreference){if(locale!=='en'&&locale!=='zh')throw new Error('Invalid locale');this.persist({...this.load(),preferences:{...this.load().preferences,locale,updatedAt:Date.now()}});}
  async exportData(){return JSON.stringify(this.load(),null,2);}
  async importData(json:string){if(json.length>10000000)throw new Error('Import is limited to 10 MB.');const incoming=validateData(JSON.parse(json));this.persist(mergeData(this.load(),incoming));}
}
export const learningRepository:LearningRepository = new LocalLearningRepository();

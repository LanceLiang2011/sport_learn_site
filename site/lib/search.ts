export type SearchDoc={id:string;courseId:string;courseTitle:string;chapter:string;title:string;text:string;url:string;tokens:string[]};
export function tokenize(text:string,locale:string){const normalized=text.normalize('NFKC').toLocaleLowerCase(locale==='zh'?'zh-CN':'en');const segmenter=new Intl.Segmenter(locale==='zh'?'zh-CN':'en',{granularity:'word'});return [...new Set([...segmenter.segment(normalized)].filter(s=>s.isWordLike).map(s=>s.segment))]}
export function rank(docs:SearchDoc[],query:string,locale:string,courseId=''){const q=query.normalize('NFKC').toLocaleLowerCase(locale==='zh'?'zh-CN':'en').trim();const tokens=tokenize(q,locale);return docs.filter(d=>!courseId||d.courseId===courseId).map(d=>{const t=(d.title+' '+d.text).normalize('NFKC').toLocaleLowerCase(locale==='zh'?'zh-CN':'en');const matches=tokens.filter(x=>d.tokens.includes(x)||t.includes(x)).length;return {doc:d,score:matches===tokens.length&&tokens.length?(t.includes(q)?10:0)+(d.title.toLowerCase().includes(q)?15:0)+matches:0}}).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,60)}
/** Offset-preserving literal matches, including separated query terms. */
export function matchRanges(text:string,query:string,locale:string):{start:number;end:number}[]{
 const haystack=text.toLocaleLowerCase(locale==='zh'?'zh-CN':'en');
 const needles=[query.trim(),...tokenize(query,locale)].map(s=>s.toLocaleLowerCase(locale==='zh'?'zh-CN':'en')).filter(Boolean);
 const raw:{start:number;end:number}[]=[];
 for(const needle of new Set(needles)){let offset=0,index:number;while((index=haystack.indexOf(needle,offset))>=0){raw.push({start:index,end:index+needle.length});offset=index+Math.max(1,needle.length);}}
 const merged:{start:number;end:number}[]=[];for(const range of raw.sort((a,b)=>a.start-b.start||b.end-a.end)){const last=merged[merged.length-1];if(last&&range.start<=last.end)last.end=Math.max(last.end,range.end);else merged.push({...range});}return merged;
}
export function searchSnippet(text:string,query:string,locale:string,limit=240):string{const first=matchRanges(text,query,locale)[0]?.start??0;const start=Math.max(0,first-70);return `${start?'…':''}${text.slice(start,start+limit)}${text.length>start+limit?'…':''}`;}

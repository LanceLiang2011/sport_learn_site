import fs from 'node:fs';import path from 'node:path';import type {Course} from './types';
export function courses(locale='en'):Course[]{const dir=path.join(process.cwd(),'content/courses');return fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>f.endsWith(`.${locale==='zh'?'zh-CN':'en'}.json`)).sort().map(f=>JSON.parse(fs.readFileSync(path.join(dir,f),'utf8')) as Course):[];}
export function course(id:string,locale='en'){const c=courses(locale).find(c=>c.id===id);if(!c)throw new Error('Unknown course');return c;}
export const lessonUrl=(c:string,l:string,locale='en')=>`/${locale}/courses/${c}/${l}/`;

import fs from 'node:fs';import path from 'node:path';import {courses} from '../site/lib/content';import {tokenize,type SearchDoc} from '../site/lib/search';
// Run from site/; index only rendered educational text. Never include extracts or notes.
const strip=(s:string)=>s.replace(/\[([^\]]+)\]\([^)]*\)/g,'$1').replace(/[#*_`>|]/g,' ').replace(/\s+/g,' ').trim();
for(const locale of ['en','zh']){
 const documents:SearchDoc[]=[];
 for(const c of courses(locale)){
  for(const ch of c.chapters)for(const l of ch.lessons){
   for(const s of l.sections){const text=strip(`${l.summary} ${s.markdown}`);documents.push({id:`${c.id}-${s.id}`,courseId:c.id,courseTitle:c.title,chapter:ch.title,title:`${l.title} — ${s.title}`,text,url:`/${locale}/courses/${c.id}/${l.id}/#${s.id}`,tokens:tokenize(`${l.title} ${s.title} ${text}`,locale)})}
   const recapTitle=locale==='zh'?'要点回顾':'Key takeaways';const recap=strip(l.recap.join(' '));documents.push({id:`${c.id}-${l.id}-recap`,courseId:c.id,courseTitle:c.title,chapter:ch.title,title:`${l.title} — ${recapTitle}`,text:recap,url:`/${locale}/courses/${c.id}/${l.id}/#${l.id}-recap`,tokens:tokenize(`${l.title} ${recapTitle} ${recap}`,locale)});
   for(const interactionId of l.interactionIds){const item=c.interactions.find(i=>i.id===interactionId);if(!item)throw Error(`Unknown interaction ${interactionId}`);const steps=(item.config.steps||item.config.scenarios||[]) as Record<string,unknown>[];const labels=steps.flatMap(s=>[s.title,s.description,s.label,s.feedback]).filter(v=>typeof v==='string').join(' ');const text=strip([item.objective,item.rationale,item.assumptions,item.staticAlternative,item.verification,labels].join(' '));documents.push({id:`${c.id}-interaction-${item.id}`,courseId:c.id,courseTitle:c.title,chapter:ch.title,title:`${l.title} — ${item.title}`,text,url:`/${locale}/courses/${c.id}/${l.id}/#${item.id}`,tokens:tokenize(`${l.title} ${item.title} ${text}`,locale)});}
  }
  for(const t of c.glossary){const text=`${t.aliases.join(' ')} ${t.definition}`;documents.push({id:`${c.id}-term-${t.id}`,courseId:c.id,courseTitle:c.title,chapter:locale==='zh'?'术语表':'Glossary',title:t.term,text,url:`/${locale}/glossary/#${c.id}-${t.id}`,tokens:tokenize(`${t.term} ${text}`,locale)})}
 }
 fs.mkdirSync(path.resolve('public/search'),{recursive:true});fs.writeFileSync(path.resolve(`public/search/${locale}.json`),JSON.stringify(documents));console.log(`${locale}: ${documents.length} searchable sections, recaps, interactions and terms`)
}

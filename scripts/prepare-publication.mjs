/** Positive allowlist: books, extracts and source ledgers cannot be selected. */
import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');const target=path.join(root,'publish/source');
fs.mkdirSync(target,{recursive:true});
const excluded=new Set(['node_modules','.next','out','.git','.DS_Store','tsconfig.tsbuildinfo']);
for(const name of ['site','scripts','.agents','AGENTS.md','README.md','DESIGN.md','QUALITY.md','package.json','package-lock.json','.gitignore']){
 const src=path.join(root,name);if(!fs.existsSync(src))continue;
 fs.cpSync(src,path.join(target,name),{recursive:true,filter:p=>!excluded.has(path.basename(p))&&!path.basename(p).startsWith('.env')});
}
fs.mkdirSync(path.join(target,'.openai'),{recursive:true});fs.copyFileSync(path.join(root,'site/.openai/hosting.json'),path.join(target,'.openai/hosting.json'));
console.log(target);

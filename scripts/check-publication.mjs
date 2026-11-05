/** Scan actual output/package staging directories, not merely ignore rules. */
import fs from 'node:fs';
import path from 'node:path';
const targets=process.argv.slice(2);
if(!targets.length){console.error('Usage: node scripts/check-publication.mjs <static-output-or-sanitized-source-directory> [...]');process.exit(1);}
const findings=[];let count=0;
const forbiddenParts=new Set(['book','books','private','node_modules','.next','.git','__pycache__']);
const forbiddenExt=/\.(?:epub|pdf|mobi|azw3?|djvu|docx?|pyc)$/i;
function walk(root,dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name),relative=path.relative(root,file);if(entry.isSymbolicLink()){findings.push(`${file}: symbolic link may escape reviewed directory`);continue;}if(forbiddenParts.has(entry.name)||/^\.env(?:\.|$)/.test(entry.name)||/^(?:credentials|id_rsa|id_ed25519|page-\d+\.(?:txt|png))$/i.test(entry.name)){findings.push(`${file}: private authoring/runtime artifact`);continue;}if(entry.isDirectory()){walk(root,file);continue;}count++;if(forbiddenExt.test(file))findings.push(`${file}: original-book/document format requires explicit publication review`);if(/\.(?:txt|json|js|mjs|ts|tsx|md|html|css|map)$/i.test(file)&&fs.statSync(file).size<20_000_000){const content=fs.readFileSync(file,'utf8');if(/-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9]{30,}|sk-proj-[A-Za-z0-9_-]{30,}/.test(content))findings.push(`${file}: credential-shaped content`);if(/(?:\/Users\/[^/\s]+\/\.codex\/attachments\/|Anna[’']s Archive)/i.test(content))findings.push(`${file}: private source provenance leaked`);}}}
for(const target of targets){const dir=path.resolve(target);if(!fs.existsSync(dir)||!fs.statSync(dir).isDirectory()){findings.push(`${dir}: directory missing`);continue;}walk(dir,dir);}
if(findings.length){console.error(findings.join('\n'));process.exitCode=1;}else console.log(`Publication boundary scan passed: ${count} actual files inspected. This scan supplements manual copyright and source-archive review.`);

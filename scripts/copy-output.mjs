import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
fs.rmSync(path.join(root,'out'),{recursive:true,force:true});
fs.cpSync(path.join(root,'site/out'),path.join(root,'out'),{recursive:true});

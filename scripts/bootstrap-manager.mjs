import { randomBytes, pbkdf2Sync } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';

const username=(process.env.TAKT_MANAGER_USERNAME||'').trim().toLowerCase();
const password=process.env.TAKT_MANAGER_PASSWORD||'';
const name=(process.env.TAKT_MANAGER_NAME||'Руководитель').trim();
if(!/^[a-z0-9._-]{3,32}$/.test(username))throw Error('TAKT_MANAGER_USERNAME must be 3–32 lowercase Latin characters/digits/._-');
if(password.length<12||password.length>128)throw Error('TAKT_MANAGER_PASSWORD must be 12–128 characters');
if(name.length<2||name.length>80)throw Error('TAKT_MANAGER_NAME must be 2–80 characters');
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const id='takt-primary-manager',salt=randomBytes(16).toString('hex');
const digest=pbkdf2Sync(password,Buffer.from(salt,'utf8'),180000,32,'sha256').toString('hex');
const now=new Date().toISOString();
const sql=[
'-- One-time initial password login; ON CONFLICT never resets an existing manager password.',
"INSERT INTO members(user_id,name,role,department,universal,enabled) VALUES("+
  [id,name,'manager','mix'].map(quote).join(',')+",1,1) ON CONFLICT(user_id) DO NOTHING;",
"INSERT INTO password_accounts(username,user_id,salt,password_hash,created_at,changed_at,must_change_password) VALUES("+
  [username,id,salt,digest,now,now].map(quote).join(',')+",1) ON CONFLICT(user_id) DO NOTHING;",
'',
].join('\n');
mkdirSync('.wrangler',{recursive:true,mode:0o700});
writeFileSync('.wrangler/bootstrap-manager.sql',sql,{mode:0o600});
console.log('One-time manager bootstrap SQL prepared without including the plaintext password.');

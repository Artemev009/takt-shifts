import {randomBytes,pbkdf2Sync,timingSafeEqual} from 'node:crypto';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';

const username=(process.env.TAKT_MANAGER_USERNAME||'').trim().toLowerCase();
const password=process.env.TAKT_MANAGER_PASSWORD||'';
if(!/^[a-z0-9._-]{3,32}$/.test(username))throw Error('Missing original manager username');
if(password.length<12||password.length>128)throw Error('Missing original manager password secret');

const raw=JSON.parse(readFileSync('.wrangler/current-manager.json','utf8'));
const rows=(Array.isArray(raw)?raw:[raw]).flatMap(part=>part.results||[]);
if(rows.length!==1)throw Error('Expected exactly one existing manager password record; no changes made');
const existing=rows[0];
if(existing.username!==username||existing.must_change_password!==1)throw Error('Manager account was changed: cannot migrate automatically');
if(!/^[0-9a-f]{32}$/i.test(existing.salt)||!/^[0-9a-f]{64}$/i.test(existing.password_hash))throw Error('Unexpected old password hash format');

const originalDigest=pbkdf2Sync(password,Buffer.from(existing.salt,'utf8'),180000,32,'sha256');
const savedDigest=Buffer.from(existing.password_hash,'hex');
if(!timingSafeEqual(originalDigest,savedDigest))throw Error('Original GitHub Secret does not match the existing password: refusing rehash');

const salt=randomBytes(16).toString('hex');
const hash=pbkdf2Sync(password,Buffer.from(salt,'utf8'),100000,32,'sha256').toString('hex');
const now=new Date().toISOString();
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const sql=[
  '-- Password text is unchanged; update only if the original record is still present.',
  'UPDATE password_accounts SET salt='+quote(salt)+',password_hash='+quote(hash)+',changed_at='+quote(now),
  ' WHERE user_id='+quote('takt-primary-manager')+' AND username='+quote(username),
  ' AND password_hash='+quote(existing.password_hash)+' AND must_change_password=1;',
  'SELECT CASE WHEN EXISTS (SELECT 1 FROM password_accounts WHERE user_id='+quote('takt-primary-manager')+' AND username='+quote(username)+' AND salt='+quote(salt)+") THEN 'rehash-complete' ELSE 'unchanged-requires-manual-recovery' END AS result;",
  ''
].join('\n');
mkdirSync('.wrangler',{recursive:true,mode:0o700});
writeFileSync('.wrangler/rehash-manager.sql',sql,{mode:0o600});
console.log('Verified original password against existing salted hash; prepared same-password migration.');

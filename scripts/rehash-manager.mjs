import {randomBytes,pbkdf2Sync} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';

const username=(process.env.TAKT_MANAGER_USERNAME||'').trim().toLowerCase();
const password=process.env.TAKT_MANAGER_PASSWORD||'';
if(!/^[a-z0-9._-]{3,32}$/.test(username))throw Error('Missing original manager username');
if(password.length<12||password.length>128)throw Error('Missing original manager password secret');
const quote=s=>"'"+s.replaceAll("'","''")+"'";
const salt=randomBytes(16).toString('hex');
const hash=pbkdf2Sync(password,Buffer.from(salt,'utf8'),100000,32,'sha256').toString('hex');
const now=new Date().toISOString();
// Only a manager who has not changed the initial password can be migrated.
// Existing plaintext password remains IDENTICAL; only salt and hash are updated.
const sql=[
  '-- Rehash existing original manager credential without changing its password.',
  'UPDATE password_accounts SET salt='+quote(salt)+',password_hash='+quote(hash)+',changed_at='+quote(now),
  ' WHERE user_id='+quote('takt-primary-manager')+' AND username='+quote(username)+' AND must_change_password=1;',
  "SELECT CASE WHEN EXISTS (SELECT 1 FROM password_accounts WHERE user_id='takt-primary-manager' AND username="+quote(username)+" AND salt="+quote(salt)+") THEN 'rehash-complete' ELSE 'unchanged-requires-manual-recovery' END AS result;",
  ''
].join('\n');
mkdirSync('.wrangler',{recursive:true,mode:0o700});
writeFileSync('.wrangler/rehash-manager.sql',sql,{mode:0o600});
console.log('Safe one-time manager rehash prepared; plaintext password is never written.');

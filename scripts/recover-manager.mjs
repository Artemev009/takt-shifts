import {randomBytes, pbkdf2Sync} from 'node:crypto';
import {mkdirSync, writeFileSync} from 'node:fs';

const username=(process.env.TAKT_MANAGER_USERNAME||'').trim().toLowerCase();
const password=process.env.TAKT_MANAGER_PASSWORD||'';
if(!/^[a-z0-9._-]{3,32}$/.test(username))throw Error('Invalid manager username');
if(password.length<12||password.length>128)throw Error('Temporary password must be 12–128 characters');

const quote=value=>"'"+value.replaceAll("'","''")+"'";
const salt=randomBytes(16).toString('hex');
const hash=pbkdf2Sync(password,Buffer.from(salt,'utf8'),100000,32,'sha256').toString('hex');
const sql=[
  '-- Recover only the initial manager account while its temporary-password flag remains set.',
  `UPDATE password_accounts SET salt=${quote(salt)},password_hash=${quote(hash)},changed_at=${quote(new Date().toISOString())},must_change_password=1`,
  ` WHERE user_id='takt-primary-manager' AND username=${quote(username)} AND must_change_password=1`,
  ` AND EXISTS (SELECT 1 FROM members WHERE user_id='takt-primary-manager' AND role='manager' AND enabled=1);`,
  `SELECT CASE WHEN EXISTS (SELECT 1 FROM password_accounts WHERE user_id='takt-primary-manager' AND salt=${quote(salt)} AND must_change_password=1) THEN 'reset-complete' ELSE 'reset-not-applied' END AS result;`,
  ''
].join('\n');
mkdirSync('.wrangler',{recursive:true,mode:0o700});
writeFileSync('.wrangler/recover-manager.sql',sql,{mode:0o600});
console.log('Prepared one-time temporary-password recovery without exposing plaintext.');

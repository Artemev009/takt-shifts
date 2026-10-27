import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { mkdtempSync,readFileSync,rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname,join,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const temp=mkdtempSync(join(tmpdir(),'takt-standalone-'));
const exec=(script,env)=>spawnSync(process.execPath,[join(root,script)],{cwd:temp,env:{...process.env,...env},encoding:'utf8'});
try{
 const env={
  CLOUDFLARE_ACCOUNT_ID:'0123456789abcdef0123456789abcdef',
  CLOUDFLARE_D1_DATABASE_ID:'123e4567-e89b-42d3-a456-426614174000',
 };
 let result=exec('scripts/prepare-wrangler.mjs',env);
 assert.equal(result.status,0,result.stderr);
 const cfg=JSON.parse(readFileSync(join(temp,'wrangler.json'),'utf8'));
 assert.equal(cfg.main,'dist/server/index.js');
 assert.equal(cfg.d1_databases[0].binding,'DB');
 assert.equal(cfg.d1_databases[0].database_id,env.CLOUDFLARE_D1_DATABASE_ID);
 assert.equal(cfg.d1_databases[0].migrations_dir,'drizzle');
 assert.equal(cfg.vars.TRUST_OAI_HEADERS,'false');
 assert.equal(cfg.workers_dev,true);
 result=exec('scripts/prepare-wrangler.mjs',{CLOUDFLARE_ACCOUNT_ID:'',CLOUDFLARE_D1_DATABASE_ID:''});
 assert.notEqual(result.status,0,'deploy refuses missing credentials or database');
 const password='TestingBootstrapSecret123!',saltEnv={TAKT_MANAGER_USERNAME:'manager.test',TAKT_MANAGER_PASSWORD:password,TAKT_MANAGER_NAME:'Руководитель'};
 result=exec('scripts/bootstrap-manager.mjs',saltEnv);
 assert.equal(result.status,0,result.stderr);
 const sql=readFileSync(join(temp,'.wrangler/bootstrap-manager.sql'),'utf8');
 assert.match(sql,/INSERT INTO password_accounts/);
 assert.match(sql,/must_change_password\) VALUES\(/);
 assert.match(sql,/ON CONFLICT\(user_id\) DO NOTHING/);
 assert.doesNotMatch(sql,/TestingBootstrapSecret123!/,'plaintext password must not enter SQL');
 const match=sql.match(/'([0-9a-f]{32})','([0-9a-f]{64})'/);
 assert.ok(match,'salt and password hash stored as hex');
 assert.equal(match[2],pbkdf2Sync(password,Buffer.from(match[1],'utf8'),180000,32,'sha256').toString('hex'));
 result=exec('scripts/bootstrap-manager.mjs',{TAKT_MANAGER_USERNAME:'manager.test',TAKT_MANAGER_PASSWORD:'123'});
 assert.notEqual(result.status,0,'weak bootstrap password is rejected');
 console.log('Standalone deployment config and manager bootstrap checks passed');
}finally{rmSync(temp,{recursive:true,force:true})}

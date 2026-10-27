import assert from 'node:assert/strict';
import { pbkdf2Sync } from 'node:crypto';
import { mkdtempSync,readFileSync,writeFileSync,rmSync } from 'node:fs';
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
 assert.equal(match[2],pbkdf2Sync(password,Buffer.from(match[1],'utf8'),100000,32,'sha256').toString('hex'));
 result=exec('scripts/bootstrap-manager.mjs',{TAKT_MANAGER_USERNAME:'manager.test',TAKT_MANAGER_PASSWORD:'123'});
 assert.notEqual(result.status,0,'weak bootstrap password is rejected');
 const oldSalt='0123456789abcdef0123456789abcdef';
 const oldHash=pbkdf2Sync(password,Buffer.from(oldSalt,'utf8'),180000,32,'sha256').toString('hex');
 writeFileSync(join(temp,'.wrangler/current-manager.json'),JSON.stringify([{results:[{
   username:'manager.test',salt:oldSalt,password_hash:oldHash,must_change_password:1
 }]}]));
 result=exec('scripts/rehash-manager.mjs',saltEnv);
 assert.equal(result.status,0,result.stderr);
 const rehash=readFileSync(join(temp,'.wrangler/rehash-manager.sql'),'utf8');
 assert.match(rehash,/user_id='takt-primary-manager'/);
 assert.match(rehash,/must_change_password=1/,'never overwrite a password already changed by the manager');
 assert.doesNotMatch(rehash,/TestingBootstrapSecret123!/,'never write a plaintext password to the rehash file');
 const rerunHash=rehash.match(/salt='([0-9a-f]{32})',password_hash='([0-9a-f]{64})'/);
 assert.ok(rerunHash,'salt/hash use the existing PBKDF2 record shape');
 assert.equal(rerunHash[2],pbkdf2Sync(password,Buffer.from(rerunHash[1],'utf8'),100000,32,'sha256').toString('hex'));
 result=exec('scripts/rehash-manager.mjs',{...saltEnv,TAKT_MANAGER_PASSWORD:'A-different-strong-password'});
 assert.notEqual(result.status,0,'mismatching GitHub secret must never overwrite manager credentials');
 const deployWorkflow=readFileSync(join(root,'.github/workflows/deploy-worker.yml'),'utf8');
 assert.match(deployWorkflow,/set -Eeuo pipefail/,'deploy must fail when Wrangler fails inside tee pipeline');
 assert.match(deployWorkflow,/grep -Fq 'binding DB of type d1 failed to generate'/,'retry only the observed Cloudflare D1 binding error');
 console.log('Standalone deployment config and manager bootstrap checks passed');
}finally{rmSync(temp,{recursive:true,force:true})}

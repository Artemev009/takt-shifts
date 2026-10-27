import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const dir=mkdtempSync(join(tmpdir(),'takt-public-smoke-'));
const url='https://takt-shifts-live.demo-account.workers.dev/';
try{
  mkdirSync(join(dir,'.wrangler'));
  writeFileSync(join(dir,'.wrangler/deploy-output.log'),'Published app to '+url+'\n');
  const preload=join(dir,'mock.mjs');
  writeFileSync(preload,`
    const url=${JSON.stringify(url)};
    globalThis.fetch=async function(path){
      if(path===url+'healthz')return Response.json({ready:true});
      if(path===url)return new Response('<form id="loginForm"></form>');
      if(path===url+'manifest.webmanifest')return Response.json({display:'standalone'});
      if(path.startsWith(url+'api/state?'))return Response.json({error:'Требуется вход'},{status:401});
      throw new Error('Unexpected URL '+path);
    };
  `);
  const run=spawnSync(process.execPath,['--import',preload,join(root,'scripts/verify-public.mjs')],{cwd:dir,encoding:'utf8'});
  assert.equal(run.status,0,run.stderr||run.stdout);
  assert.match(run.stdout,/Verified public app/);
  assert.match(run.stdout,/takt-shifts-live.demo-account.workers.dev/);
  console.log('Public worker smoke test passed with stubbed network');
}finally{
  rmSync(dir,{recursive:true,force:true});
}

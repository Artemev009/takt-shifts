import {readFileSync,appendFileSync} from 'node:fs';
const log=readFileSync('.wrangler/deploy-output.log','utf8');
const match=log.match(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev\/?/i);
if(!match)throw Error('Wrangler deployment log did not contain a workers.dev URL');
const base=match[0].replace(/\/?$/,'/');
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
let last='';
for(let attempt=0;attempt<6;attempt++){
  try{
    const options={redirect:'error',cache:'no-store',signal:AbortSignal.timeout(12000)};
    const health=await fetch(base+'healthz',options);
    const ready=await health.json();
    if(health.status!==200||ready.ready!==true)throw Error('Server/database readiness failed: '+health.status);
    const homepage=await fetch(base,options);
    const html=await homepage.text();
    if(homepage.status!==200||!html.includes('id="loginForm"'))throw Error('Independent login page not available');
    const manifest=await fetch(base+'manifest.webmanifest',options);
    const pwa=await manifest.json();
    if(manifest.status!==200||pwa.display!=='standalone')throw Error('PWA is not available');
    const privateApi=await fetch(base+'api/state?date=2026-10-27',options);
    if(privateApi.status!==401)throw Error('Private API is not restricted');
    console.log('Verified public app: '+base);
    if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'\n### Такт — публичное веб-приложение\n\n'+base+'\n\nСервер, D1, вход, PWA и закрытый API: проверены.\n');
    process.exit(0);
  }catch(e){last=e.message;await sleep(2000*(attempt+1));}
}
throw Error('Published app did not pass verification: '+last);

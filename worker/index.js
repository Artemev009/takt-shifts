import page from './page.js';
const withPwa=html=>html.replace('<head>','<head><meta name="theme-color" content="#0c428b"><meta name="apple-mobile-web-app-capable" content="yes"><link rel="manifest" href="/manifest.webmanifest"><link rel="icon" href="/icon.svg" type="image/svg+xml"><link rel="apple-touch-icon" href="/icon-192.png">').replace('</body>','<script>if(\'serviceWorker\'in navigator)navigator.serviceWorker.register(\'/sw.js\')</script></body>');
const loginPage="<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>Такт · Вход для сотрудников GVA</title><style>*{box-sizing:border-box}body{margin:0;font:15px/1.5 system-ui,-apple-system,\"Segoe UI\",sans-serif;color:#162b4c;background:#f5f8fd}header{display:flex;align-items:center;justify-content:space-between;padding:22px min(6vw,90px);background:white;border-bottom:1px solid #e6edf7}.logo{font-size:27px;letter-spacing:-1px;color:#0c3980;font-weight:850}.logo b{color:#e03d47}.tiny{font-size:11px;font-weight:750;letter-spacing:1.3px;color:#67778b}main{max-width:1180px;min-height:calc(100vh - 174px);margin:auto;display:grid;grid-template-columns:1.25fr .85fr;align-items:center;gap:60px;padding:70px 35px}.eyebrow{color:#e03d47;font-size:12px;font-weight:800;letter-spacing:1.5px}h1{font-size:clamp(33px,4.2vw,65px);line-height:1.08;letter-spacing:-2px;margin:20px 0}h1 em{font-style:normal;color:#e03d47}.lead{font-size:17px;color:#657790;max-width:550px}.features{display:grid;grid-template-columns:1fr 1fr;gap:15px;margin-top:35px}.feature{border:1px solid #e3eaf6;padding:16px 15px;border-radius:16px;background:white;font-size:13px;font-weight:700}.feature i{display:inline-grid;place-items:center;width:34px;height:34px;margin-right:9px;border-radius:10px;background:#e9f2ff;color:#0b4b9c;font-size:20px;font-style:normal}.card{padding:34px;background:white;border:1px solid #e4ebf5;border-radius:23px;box-shadow:0 30px 70px #184b8d19}h2{font-size:25px;letter-spacing:-.8px;margin:10px 0}.card p{color:#8090a5;font-size:13px}.field{display:block;margin:19px 0;font-size:12px;font-weight:700}.field input{width:100%;border:1px solid #d6e2f0;border-radius:10px;padding:13px;margin-top:7px;font:inherit;outline-color:#3079cf}.btn{display:block;background:#104c98;color:white;text-align:center;padding:13px;border:0;border-radius:12px;font-size:13px;font-weight:800;width:100%;cursor:pointer;text-decoration:none}.other{display:block;text-align:center;margin-top:14px;color:#0a529d;font-size:12px;text-decoration:none}.error{color:#b92732;min-height:18px;font-size:12px}.foot{font-size:11px;color:#93a2b2;padding:17px 6vw;border-top:1px solid #e1eaf6}@media(max-width:800px){main{grid-template-columns:1fr;padding:40px 22px;gap:28px}.features{margin-top:25px}.card{padding:25px}header{padding:16px 24px}}</style></head><body><header><div class=\"logo\">G<b>V</b>A <span style=\"font-size:14px;color:#203953\">/ Такт</span></div><div class=\"tiny\">СЕРВИСНЫЙ ЦЕНТР 24/7</div></header><main><section><span class=\"eyebrow\">ЕДИНОЕ ПРОСТРАНСТВО КОМАНДЫ</span><h1>Worldwide Travel &amp; Maritime <em>Medical Assistance</em></h1><p class=\"lead\">Расписание команды, заявки на смены и потребность сервисного центра — в одном защищённом кабинете.</p><div class=\"features\"><div class=\"feature\"><i>✈</i> Медицинская эвакуация</div><div class=\"feature\"><i>✚</i> Медицинский ассистанс</div><div class=\"feature\"><i>⚓</i> Морское сопровождение</div><div class=\"feature\"><i>◷</i> Поддержка 24/7</div></div></section><section class=\"card\"><div class=\"eyebrow\">ТАКТ · ЛИЧНЫЙ КАБИНЕТ</div><h2>Вход в систему</h2><p>Логин и временный пароль выдаёт руководитель. После входа вы увидите собственные заявки и общее расписание.</p><form id=\"loginForm\"><label class=\"field\">Логин<input name=\"username\" autocomplete=\"username\" placeholder=\"Ваш логин\" required minlength=\"3\" maxlength=\"32\"></label><label class=\"field\">Пароль<input name=\"password\" type=\"password\" autocomplete=\"current-password\" placeholder=\"Ваш пароль\" required></label><div class=\"error\" id=\"err\" role=\"alert\"></div><button class=\"btn\" type=\"submit\">Войти в личный кабинет</button></form><a class=\"other\" href=\"/signin-with-chatgpt?return_to=%2F\">Войти через доступ ChatGPT Sites</a><p>Если у вас пока нет логина, обратитесь к руководителю смены.</p></section></main><div class=\"foot\">Такт · внутреннее приложение сервисного центра. Используйте только персональные учётные данные.</div><script>document.getElementById('loginForm').addEventListener('submit',async function(e){e.preventDefault();var form=e.target,button=form.querySelector('button'),error=document.getElementById('err');button.disabled=true;error.textContent='';try{var r=await fetch('/api/auth/login',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({username:form.elements.username.value,password:form.elements.password.value})});var ct=r.headers.get('content-type')||'';if(!ct.includes('application/json'))throw Error('Сервер входа вернул HTTP '+r.status+' вместо ответа приложения. Пароль не изменён.');var data=await r.json();if(!r.ok)throw Error(data.error||'Ошибка входа');location.replace('/')}catch(ex){error.textContent=ex.message;button.disabled=false}})</script></body></html>";
const changePasswordPage="<!doctype html><html lang=\"ru\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1,viewport-fit=cover\"><meta name=\"theme-color\" content=\"#0c428b\"><link rel=\"manifest\" href=\"/manifest.webmanifest\"><link rel=\"icon\" href=\"/icon.svg\" type=\"image/svg+xml\"><title>Такт · Новый пароль</title><style>*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;background:#eef3fa;color:#172f53;font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}.card{width:min(440px,100%);background:#fff;border:1px solid #dfe8f5;border-radius:24px;padding:32px;box-shadow:0 28px 70px #123d7818}.logo{font-size:25px;font-weight:850;color:#0c428b}.logo b{color:#df3d4c}h1{font-size:27px;line-height:1.15;margin:24px 0 10px}.hint{color:#6d7d93;font-size:13px}.field{display:block;margin:18px 0 0;font-size:12px;font-weight:750}.field input{width:100%;padding:13px;margin-top:7px;border:1px solid #d3e0f0;border-radius:11px;font:inherit}.btn{width:100%;border:0;border-radius:12px;padding:13px;margin-top:22px;background:#104c98;color:#fff;font-weight:800}.error{min-height:20px;margin-top:12px;color:#b92f3b;font-size:12px}</style></head><body><main class=\"card\"><div class=\"logo\">G<b>V</b>A / Такт</div><h1>Задайте личный пароль</h1><p class=\"hint\">Временный пароль больше нельзя использовать как постоянный. Новый пароль должен содержать не менее 12 символов.</p><form id=\"changeForm\"><label class=\"field\">Текущий временный пароль<input name=\"currentPassword\" type=\"password\" autocomplete=\"current-password\" required></label><label class=\"field\">Новый пароль<input name=\"newPassword\" type=\"password\" autocomplete=\"new-password\" minlength=\"12\" maxlength=\"128\" required></label><label class=\"field\">Повторите новый пароль<input name=\"confirmPassword\" type=\"password\" autocomplete=\"new-password\" minlength=\"12\" maxlength=\"128\" required></label><div id=\"err\" class=\"error\" role=\"alert\"></div><button class=\"btn\" type=\"submit\">Сохранить и продолжить</button></form></main><script>if('serviceWorker'in navigator)navigator.serviceWorker.register('/sw.js');document.getElementById('changeForm').addEventListener('submit',async function(e){e.preventDefault();var f=e.target,er=document.getElementById('err'),b=f.querySelector('button');er.textContent='';if(f.newPassword.value!==f.confirmPassword.value){er.textContent='Пароли не совпадают';return}b.disabled=true;try{var r=await fetch('/api/auth/change-password',{method:'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:JSON.stringify({currentPassword:f.currentPassword.value,newPassword:f.newPassword.value})}),d=await r.json();if(!r.ok)throw Error(d.error||'Не удалось изменить пароль');location.replace('/')}catch(x){er.textContent=x.message;b.disabled=false}})</script></body></html>";
const manifest={name:'Такт — график GVA',short_name:'Такт',description:'Расписание, заявки и учёт смен сервисного центра GVA',lang:'ru',start_url:'/',scope:'/',display:'standalone',display_override:['standalone','minimal-ui'],orientation:'any',background_color:'#eef3fa',theme_color:'#0c428b',categories:['business','productivity'],icons:[{src:'/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any maskable'},{src:'/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'},{src:'/icon.svg',sizes:'any',type:'image/svg+xml',purpose:'any'}]};
const serviceWorker="self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;event.respondWith(fetch(event.request))});";
const appIcon='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#0c428b"/><path d="M116 126h280v72H292v234h-72V198H116z" fill="#fff"/><path d="M348 80h68v68h-68z" rx="14" fill="#e23b4d"/></svg>';
const icon192='iVBORw0KGgoAAAANSUhEUgAAAMAAAADACAYAAABS3GwHAAABvElEQVR42u3TQQ0AIBADwROAI378UYZLjBw2mjCPMdBma6zT8KsyAgIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEQJ47dyQBIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIAABIADHIwAQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAIQAAQTAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAEIAREAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAQAAgABgABAACAAEAAIAASAAAyBAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABABBHsr81x+0fkfpAAAAAElFTkSuQmCC';
const icon512='iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAH+ElEQVR42u3WMQ0AIAxFwQrAEVt3lOESIyChaxNuOAM/afpi5L4AwF/CCAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAEBHZy4aEgAACAABIAAAEAACQAAAIAAEgAAAQAAIAAEAgAAQAAIAAAEgAAQAAAJAAAgAAAGAABAAAAIAASAAAAQAAkAAAAgABIAAABAACAABACAAEAACAEAAIAAEAIAAQAAIAAABgAAQAAACAAEAgAAQAAIAAAEgAAQAAAJAAAgAAASAABAAAAgAASAAABAAAkAAACAABIAAABAACAABACAAEAACAEAAIAAEAIAAQAAIAAABgAAQAAACAAEgAAAEAAJAAAAIAASAAAAQAAgAAQAgABAAAAgAASAAABAAAkAAACAABIAAAEAACAABAIAAEAACAAABIAAEAAACQAAIAAABgAAQAAACAAEgAAAEAAJAAAAIAASAAAAQAAgAAQAgABAAAgBAACAABACAAEAACAAAAYAAEAAAAgABAIAAEAACAAABIAAEAAACQAAIAAAEgAAQAAAIAAEgAAAQAAJAAAAgAASAAAAQAAgAAQAgABAAAgBAACAABACAAEAACAAAAYAAEAAAAgABIAAABAACQAAACAAEgAAAEAAIAAEAIAAQAA4SQAAIAAEAgAAQAAIAAAEgAAQAAAJAAAgAAASAABAAAAgAASAAABAAAkAAAODZCgABACAAEAACAEAAIAAEAIAAQAAIAAABgAAQAAACAAEgAAAEAAJAAAAIAASAAAAQAAgAAQAgABAAAgBAACAAABAAAkAAACAABIAAAEAACAABAIAAEAACAAABIAAEAAACQAAIAAAEgAAQAAACAAEgAAAEAAJAAAAIAASAAAAQAAgAAQAgABAAAgBAACAABACAAEAACAAAAYAAEAAAgAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAAAgAIwCAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAEABGAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAAAgAIwAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAAABAAAIAABAAAAAAgAAEAAAgAAAAAQAACAAAEAAGAEABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAAIAAAAAEAAAgAAEAAAAACAAAQAACAAAAABAAACAAAQAAAAAIAABAAAIAAAAAEAAAgAAAAAQAACAAAQAAAAAIAABAAAIAAAAAEAABQe6CwdN7Gou+yAAAAAElFTkSuQmCC';
const pngResponse=b64=>new Response(Uint8Array.from(atob(b64),c=>c.charCodeAt(0)),{headers:{...securityHeaders,'content-type':'image/png','cache-control':'public, max-age=86400'}});
const securityHeaders={'x-content-type-options':'nosniff','referrer-policy':'same-origin','permissions-policy':'camera=(), microphone=(), geolocation=()','strict-transport-security':'max-age=31536000; includeSubDomains','content-security-policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; manifest-src 'self'"};
const defaults=Array(12).fill(0);
const json=(v,status=200)=>new Response(JSON.stringify(v),{status,headers:{...securityHeaders,'content-type':'application/json; charset=utf-8','cache-control':'no-store'}}),fail=(error,status=400)=>json({error},status);
async function getMember(db,id,email,name,managerEmail){const role=managerEmail.split(',').map(x=>x.trim().toLowerCase()).includes(email.toLowerCase())?'manager':'employee';await db.prepare('INSERT INTO members(user_id,name,role) VALUES(?,?,?) ON CONFLICT(user_id) DO UPDATE SET role=excluded.role,name=excluded.name').bind(id,name,role).run();const permissions=await db.prepare('SELECT department,universal,enabled FROM members WHERE user_id=?').bind(id).first();if(!permissions?.enabled)return {role:'blocked',name,email};return {role,name,email,department:permissions.department,universal:!!permissions.universal}}
async function log(db,message){await db.prepare('INSERT INTO activity(message,created_at) VALUES(?,?)').bind(message,new Date().toISOString()).run()}
async function state(db,id,m,date){const [nr,sr,own,events,old]=await Promise.all([db.prepare('SELECT hour,count FROM needs WHERE work_date=?').bind(date).all(),db.prepare('SELECT s.user_id,s.start,s.end,s.in_at,s.out_at,s.status,s.department,s.rejection_reason,s.short_reason,s.short_review_status,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.work_date=?').bind(date).all(),db.prepare('SELECT start,end,in_at,out_at,status,rejection_reason,short_reason,short_review_status FROM shifts WHERE user_id=? AND work_date=?').bind(id,date).first(),db.prepare('SELECT message FROM activity ORDER BY id DESC LIMIT 5').all(),db.prepare('SELECT payload FROM app_state WHERE id=1').first()]);let legacy;try{legacy=JSON.parse(old?.payload||'{}')}catch{legacy={}}const inherited=Array.isArray(legacy.need)&&legacy.need.length===12;const need=inherited?[...legacy.need]:[...defaults],needConfigured=Array(12).fill(inherited);for(const n of nr.results){need[n.hour-8]=n.count;needConfigured[n.hour-8]=true}const team=sr.results.map(s=>({name:s.name,start:s.start,end:s.end,in:s.in_at,out:s.out_at,status:s.status==='pending'?'На согласовании':s.status==='rejected'?'Отклонена':s.out_at?(new Date(s.out_at)-new Date(s.in_at)<5*3600000?'Меньше 5 часов':'Завершил'):s.in_at?'На работе':'Подтверждена',actualHours:s.in_at&&s.out_at?Math.round((new Date(s.out_at)-new Date(s.in_at))/360000)/10:null,reason:s.status==='rejected'?s.rejection_reason:s.short_reason,reviewStatus:s.short_review_status}));const people=sr.results.filter(s=>s.user_id!==id&&s.status==='approved').map((s,i)=>({name:m.role==='manager'?s.name:`Сотрудник ${i+1}`,start:s.start,end:s.end,department:s.department}));return {state:{need,needConfigured,people,my:own?{start:own.start,end:own.end,status:own.status,rejectionReason:own.rejection_reason}:null,attendance:own?.in_at?{in:own.in_at,out:own.out_at,shortReason:own.short_reason,reviewStatus:own.short_review_status}:null,events:m.role==='manager'?events.results.map(e=>e.message):[]},role:m.role,userId:id,name:m.name,email:m.email,activeCount:date===new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())?sr.results.filter(s=>s.in_at&&!s.out_at).length:0,team:m.role==='manager'?team:undefined,pending:m.role==='manager'?sr.results.filter(s=>s.status==='pending').map(s=>({userId:s.user_id,name:s.name,start:s.start,end:s.end,department:s.department})):undefined}}
const validDate=d=>/^\d{4}-\d{2}-\d{2}$/.test(d||'')&&!Number.isNaN(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
const addDays=(d,n)=>new Date(Date.parse(d)+n*86400000).toISOString().slice(0,10);
async function week(db,start){const end=addDays(start,6);const [nr,sr,old]=await Promise.all([db.prepare('SELECT work_date,hour,count FROM needs WHERE work_date BETWEEN ? AND ?').bind(start,end).all(),db.prepare('SELECT work_date,start,end,status FROM shifts WHERE work_date BETWEEN ? AND ?').bind(start,end).all(),db.prepare('SELECT payload FROM app_state WHERE id=1').first()]);let legacy;try{legacy=JSON.parse(old?.payload||'{}')}catch{legacy={}}const baseline=Array.isArray(legacy.need)&&legacy.need.length===12?legacy.need:defaults;const days=Array.from({length:7},(_,i)=>{const date=addDays(start,i),need=[...baseline],configured=new Set();for(const row of nr.results)if(row.work_date===date){need[row.hour-8]=row.count;configured.add(row.hour)}const shifts=sr.results.filter(s=>s.work_date===date),approved=shifts.filter(s=>s.status==='approved'),pending=shifts.filter(s=>s.status==='pending').length;let required=0,filled=0,shortHours=0;for(let h=8;h<20;h++){const count=approved.filter(s=>s.start<=h&&s.end>h).length,want=need[h-8];required+=want;filled+=Math.min(count,want);if(count<want)shortHours++}return {date,coverage:configured.size||legacy.need?.length===12?(required?Math.round(filled/required*100):100):null,configuredHours:configured.size|| (legacy.need?.length===12?12:0),shortHours,pending,approved:approved.length}});return {days}}
async function schedule(db,start){const end=addDays(start,6),rows=(await db.prepare('SELECT s.user_id,s.work_date,s.start,s.end,s.status,s.in_at,s.out_at,s.department,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.work_date BETWEEN ? AND ? ORDER BY m.name,s.work_date').bind(start,end).all()).results;const people=new Map();for(const s of rows){if(!people.has(s.user_id))people.set(s.user_id,{userId:s.user_id,name:s.name,days:{}});people.get(s.user_id).days[s.work_date]={start:s.start,end:s.end,department:s.department,status:s.status,completed:!!s.out_at,active:!!s.in_at&&!s.out_at}}return {dates:Array.from({length:7},(_,i)=>addDays(start,i)),people:[...people.values()]}}
async function history(db,start,id,role){const end=addDays(start,6),manager=role==='manager';const sql='SELECT s.user_id,s.work_date,s.start,s.end,s.in_at,s.out_at,s.status,s.rejection_reason,s.short_reason,s.short_review_status,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.work_date BETWEEN ? AND ?'+(manager?'':' AND s.user_id=?')+' ORDER BY s.work_date,s.start';const rows=(await db.prepare(sql).bind(...(manager?[start,end]:[start,end,id])).all()).results;const mapped=rows.map(s=>{const actual=s.in_at&&s.out_at?Math.max(0,(new Date(s.out_at)-new Date(s.in_at))/3600000):null;return {date:s.work_date,name:s.name,start:s.start,end:s.end,status:s.status==='pending'?'На согласовании':s.status==='rejected'?'Отклонена':s.out_at?(actual<5?'Меньше 5 часов':'Завершил'):s.in_at?'На работе':'Подтверждена',plannedHours:s.status==='approved'?s.end-s.start:0,actualHours:actual===null?null:Math.round(actual*10)/10,reason:s.status==='rejected'?s.rejection_reason:s.short_reason,reviewStatus:s.short_review_status,userId:s.user_id}});if(!manager)return {rows:mapped.map(({userId,...r})=>r)};const groups=new Map();for(const r of mapped){let g=groups.get(r.userId);if(!g){g={name:r.name,plannedHours:0,actualHours:0,shortShifts:0,pending:0,completed:0};groups.set(r.userId,g)}g.plannedHours+=r.plannedHours;g.actualHours+=r.actualHours??0;g.shortShifts+=Number(r.status==='Меньше 5 часов');g.pending+=Number(r.status==='На согласовании');g.completed+=Number(r.actualHours!==null)}return {people:[...groups.values()].map(g=>({...g,actualHours:Math.round(g.actualHours*10)/10}))}}
const moscowToday=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Moscow',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const moscowMinute=()=>{const parts=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());return Number(parts.find(x=>x.type==='hour').value)*60+Number(parts.find(x=>x.type==='minute').value)};
const hex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
async function hashCode(salt,code){const bytes=new TextEncoder().encode(`${salt}:${code}`),digest=await crypto.subtle.digest('SHA-256',bytes);return hex(new Uint8Array(digest))}
async function verifyAttendanceCode(db,id,date,code){if(typeof code!=='string'||!/^[0-9]{6}$/.test(code))return 'Введите шестизначный код точки';const attempts=await db.prepare('SELECT failures,blocked_until FROM attendance_attempts WHERE user_id=? AND work_date=?').bind(id,date).first();if(attempts?.blocked_until&&attempts.blocked_until>new Date().toISOString())return 'Слишком много попыток. Повторите через 15 минут';const record=await db.prepare('SELECT code_hash,expires_at FROM attendance_codes WHERE work_date=?').bind(date).first();if(!record||record.expires_at<=new Date().toISOString())return 'Код точки истёк. Попросите руководителя обновить его';const [salt,hash]=record.code_hash.split(':');const match=(await hashCode(salt,code))===hash;if(!match){const count=(attempts?.failures||0)+1,until=count>=5?new Date(Date.now()+15*60000).toISOString():null;await db.prepare('INSERT INTO attendance_attempts(user_id,work_date,failures,blocked_until) VALUES(?,?,?,?) ON CONFLICT(user_id,work_date) DO UPDATE SET failures=excluded.failures,blocked_until=excluded.blocked_until').bind(id,date,count>=5?0:count,until).run();return count>=5?'Слишком много попыток. Повторите через 15 минут':'Неверный код точки'}await db.prepare('DELETE FROM attendance_attempts WHERE user_id=? AND work_date=?').bind(id,date).run();return null}
async function audit(db,actor,target,action,date,details={}){await db.prepare('INSERT INTO audit_events(actor_id,target_id,action,work_date,details,created_at) VALUES(?,?,?,?,?,?)').bind(actor,target,action,date,JSON.stringify(details),new Date().toISOString()).run()}
async function notifyUser(db,userId,message){await db.prepare('INSERT INTO notifications(user_id,message,created_at) VALUES(?,?,?)').bind(userId,message,new Date().toISOString()).run()}
async function notifyManagers(db,message){const rows=(await db.prepare("SELECT user_id FROM members WHERE role='manager'").all()).results;for(const row of rows)await notifyUser(db,row.user_id,message)}
async function notifications(db,id){const rows=(await db.prepare('SELECT id,message,created_at,read_at FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 30').bind(id).all()).results;return {rows,unread:rows.filter(x=>!x.read_at).length}}
async function auditTrail(db){const rows=(await db.prepare('SELECT a.action,a.work_date,a.details,a.created_at,actor.name AS actor,target.name AS target FROM audit_events a LEFT JOIN members actor ON actor.user_id=a.actor_id LEFT JOIN members target ON target.user_id=a.target_id ORDER BY a.id DESC LIMIT 100').all()).results;return {rows:rows.map(x=>({action:x.action,date:x.work_date,details:JSON.parse(x.details||'{}'),at:x.created_at,actor:x.actor||'Система',target:x.target||null}))}}
async function extendedState(db,id,m,date){const base=await state(db,id,m,date);const own=await db.prepare('SELECT status,start,end FROM availability WHERE user_id=? AND work_date=?').bind(id,date).first();base.availability=own||null;const member=await db.prepare('SELECT department,universal,enabled FROM members WHERE user_id=?').bind(id).first();base.department=member?.department||'mix';base.universal=!!member?.universal;if(m.role==='manager'){const roster=await db.prepare('SELECT m.name,m.user_id,a.status,a.start,a.end FROM members m LEFT JOIN availability a ON a.user_id=m.user_id AND a.work_date=? WHERE m.role=? ORDER BY m.name').bind(date,'employee').all();base.roster=roster.results.map(x=>({name:x.name,userId:x.user_id,status:x.status||null,start:x.start,end:x.end}))}return base}
async function corrections(db,id,role){const manager=role==='manager';const sql='SELECT c.id,c.user_id,c.work_date,c.kind,c.proposed_at,c.reason,c.status,c.created_at,c.reviewed_at,m.name FROM time_corrections c JOIN members m ON m.user_id=c.user_id'+(manager?'':' WHERE c.user_id=?')+' ORDER BY CASE WHEN c.status=\'pending\' THEN 0 ELSE 1 END,c.created_at DESC LIMIT 100';const rows=(await db.prepare(sql).bind(...(manager?[]:[id])).all()).results;return {rows:rows.map(x=>({id:x.id,date:x.work_date,kind:x.kind,time:x.proposed_at,reason:x.reason,status:x.status,name:x.name,createdAt:x.created_at,reviewedAt:x.reviewed_at}))}}
async function attention(db,today){
  const limit=addDays(today,6);
  const [pending,open,correction,short]=await Promise.all([
    db.prepare("SELECT s.user_id,s.work_date,s.start,s.end,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.status='pending' AND s.work_date BETWEEN ? AND ? ORDER BY s.work_date,s.start LIMIT 50").bind(today,limit).all(),
    db.prepare("SELECT s.work_date,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.in_at IS NOT NULL AND s.out_at IS NULL AND s.work_date<? ORDER BY s.work_date DESC LIMIT 20").bind(today).all(),
    db.prepare("SELECT c.id,c.work_date,c.kind,c.proposed_at,c.reason,m.name FROM time_corrections c JOIN members m ON m.user_id=c.user_id WHERE c.status='pending' ORDER BY c.created_at LIMIT 50").all(),
    db.prepare("SELECT s.user_id,s.work_date,s.in_at,s.out_at,s.short_reason,m.name FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.in_at IS NOT NULL AND s.out_at IS NOT NULL AND (strftime('%s',s.out_at)-strftime('%s',s.in_at))<18000 AND s.short_review_status IS NULL ORDER BY s.work_date DESC LIMIT 50").all()
  ]);
  return {pending:pending.results.map(x=>({userId:x.user_id,date:x.work_date,start:x.start,end:x.end,name:x.name})),open:open.results.map(x=>({date:x.work_date,name:x.name})),corrections:correction.results.map(x=>({id:x.id,date:x.work_date,kind:x.kind,time:x.proposed_at,reason:x.reason,name:x.name})),short:short.results.map(x=>({userId:x.user_id,date:x.work_date,in:x.in_at,out:x.out_at,reason:x.short_reason,name:x.name}))};
}

const DEPARTMENT_CODES=['alpha','mix','mail','mess','night'];
const moscowNowIso=()=>new Date().toISOString();
const pwText=new TextEncoder();
const secretHex=bytes=>Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
function randomHex(size=32){const bytes=new Uint8Array(size);crypto.getRandomValues(bytes);return secretHex(bytes)}
async function hashSession(token){return secretHex(new Uint8Array(await crypto.subtle.digest('SHA-256',pwText.encode(token))))}
async function hashPassword(password,salt){
  // Cloudflare Workers production enforces 100,000 PBKDF2 iterations.
  // Initial manager hashes from an older release are migrated once via a
  // secret-backed GitHub Action, keeping the original plaintext password.
  const key=await crypto.subtle.importKey('raw',pwText.encode(password),'PBKDF2',false,['deriveBits']);
  const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt:pwText.encode(salt),iterations:100000,hash:'SHA-256'},key,256);
  return secretHex(new Uint8Array(bits));
}
const validLogin=v=>typeof v==='string'&&/^[a-z0-9._-]{3,32}$/.test(v);
const validPassword=v=>typeof v==='string'&&v.length>=12&&v.length<=128;
const sessionCookie='__Host-takt_session';
function getSessionToken(request){const cookie=request.headers.get('cookie')||'';const hit=cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(sessionCookie+'='));return hit?hit.slice(sessionCookie.length+1):null}
const cookieValue=(token,maxAge)=>sessionCookie+'='+token+'; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age='+maxAge;
async function loggedInSession(db,request){
  const token=getSessionToken(request);
  if(!token||!/^[a-f0-9]{64}$/.test(token))return null;
  const digest=await hashSession(token);
  const row=await db.prepare('SELECT s.user_id,m.name,m.role,m.department,m.universal,m.enabled,s.expires_at,a.must_change_password FROM password_sessions s JOIN members m ON m.user_id=s.user_id JOIN password_accounts a ON a.user_id=s.user_id WHERE s.token_hash=?').bind(digest).first();
  if(!row||!row.enabled||row.expires_at<moscowNowIso())return null;
  return {id:row.user_id,member:{role:row.role,name:row.name,email:'',department:row.department,universal:!!row.universal,mustChangePassword:!!row.must_change_password},tokenHash:digest};
}
async function loginByPassword(db,request){
  let stage='parse';
  try{
  let body;try{body=await request.json()}catch{return fail('Некорректные данные входа')}
  const username=String(body.username||'').trim().toLowerCase(),password=body.password;
  if(!validLogin(username)||typeof password!=='string'||password.length>128)return fail('Неверный логин или пароль',401);
  stage='read-lockout';
  const now=moscowNowIso(),failure=await db.prepare('SELECT attempts,blocked_until FROM password_failures WHERE username=?').bind(username).first();
  if(failure?.blocked_until&&failure.blocked_until>now)return fail('Слишком много попыток. Повторите через 15 минут',429);
  stage='read-account';
  const account=await db.prepare('SELECT a.user_id,a.salt,a.password_hash,a.must_change_password,m.enabled FROM password_accounts a JOIN members m ON m.user_id=a.user_id WHERE a.username=?').bind(username).first();
  stage='derive-password';
  const computed=await hashPassword(password,account?.salt||'not-an-existing-account');
  if(!account||!account.enabled||computed!==account.password_hash){
    const count=(failure?.attempts||0)+1,blocked=count>=5?new Date(Date.now()+15*60000).toISOString():null;
    stage='write-lockout';
    await db.prepare('INSERT INTO password_failures(username,attempts,blocked_until) VALUES(?,?,?) ON CONFLICT(username) DO UPDATE SET attempts=excluded.attempts,blocked_until=excluded.blocked_until').bind(username,count>=5?0:count,blocked).run();
    return fail('Неверный логин или пароль',401);
  }
  stage='clear-lockout';
  await db.prepare('DELETE FROM password_failures WHERE username=?').bind(username).run();
  stage='create-session-token';
  const token=randomHex(),digest=await hashSession(token);
  stage='write-session';
  await db.prepare('INSERT INTO password_sessions(token_hash,user_id,expires_at,created_at) VALUES(?,?,?,?)').bind(digest,account.user_id,new Date(Date.now()+90*24*3600000).toISOString(),now).run();
  stage='expire-old-sessions';
  await db.prepare('DELETE FROM password_sessions WHERE expires_at<?').bind(now).run();
  return new Response(JSON.stringify({ok:true,mustChangePassword:!!account.must_change_password}),{status:200,headers:{...securityHeaders,'content-type':'application/json; charset=utf-8','cache-control':'no-store','set-cookie':cookieValue(token,90*86400)}});
  }catch(e){
    console.error('Takt login exception at '+stage, e instanceof Error?e.message:String(e));
    return fail('Сервер входа временно недоступен (AUTH_'+stage+'). Пароль не изменён.',503);
  }
}
async function listUsers(db){
  const rows=(await db.prepare("SELECT m.user_id,m.name,m.role,m.department,m.universal,m.enabled,a.username FROM members m LEFT JOIN password_accounts a ON a.user_id=m.user_id ORDER BY m.name").all()).results;
  return {users:rows.map(x=>({id:x.user_id,name:x.name,role:x.role,department:x.department,universal:!!x.universal,enabled:!!x.enabled,username:x.username||null}))};
}
async function upsertPassword(db,id,username,password,mustChange=false){
  if(!validLogin(username)||!validPassword(password))return false;
  const conflict=await db.prepare('SELECT user_id FROM password_accounts WHERE username=?').bind(username).first();
  if(conflict&&conflict.user_id!==id)return false;
  const salt=randomHex(16),digest=await hashPassword(password,salt),now=moscowNowIso();
  await db.prepare('INSERT INTO password_accounts(username,user_id,salt,password_hash,created_at,changed_at,must_change_password) VALUES(?,?,?,?,?,?,?) ON CONFLICT(user_id) DO UPDATE SET username=excluded.username,salt=excluded.salt,password_hash=excluded.password_hash,changed_at=excluded.changed_at,must_change_password=excluded.must_change_password').bind(username,id,salt,digest,now,now,mustChange?1:0).run();
  await db.prepare('DELETE FROM password_sessions WHERE user_id=?').bind(id).run();
  return true;
}
async function market(db,id,role){
 const from=moscowToday(),to=addDays(from,14);
 const rows=(await db.prepare("SELECT o.id,o.owner_id,o.work_date,o.volunteer_id,o.status,s.start,s.end,s.department,m.name AS owner_name,v.name AS volunteer_name FROM shift_offers o JOIN shifts s ON s.user_id=o.owner_id AND s.work_date=o.work_date JOIN members m ON m.user_id=o.owner_id LEFT JOIN members v ON v.user_id=o.volunteer_id WHERE o.work_date BETWEEN ? AND ? AND o.status IN ('open','claimed') ORDER BY o.work_date,s.start").bind(from,to).all()).results;
 return {offers:rows.filter(x=>role==='manager'||x.status==='open'||x.owner_id===id||x.volunteer_id===id).map(x=>({id:x.id,ownerId:x.owner_id,date:x.work_date,volunteerId:x.volunteer_id,status:x.status,start:x.start,end:x.end,department:x.department,owner:x.owner_name,volunteer:role==='manager'||x.volunteer_id===id?x.volunteer_name:null}))};
}
async function deptCoverage(db,date){
  const previous=addDays(date,-1);
  const [planned,shifts]=await Promise.all([
    db.prepare('SELECT department,hour,count FROM department_needs WHERE work_date=?').bind(date).all(),
    db.prepare("SELECT department,work_date,start,end FROM shifts WHERE work_date IN (?,?) AND status='approved'").bind(previous,date).all()
  ]);
  const plan=new Map(planned.results.map(x=>[x.department+'|'+x.hour,x.count]));
  const slots=[];
  for(const department of DEPARTMENT_CODES)for(let hour=0;hour<24;hour++){
    if(department==='night'&&hour>=8&&hour<22)continue;
    if(department!=='night'&&(hour<8||hour>=22))continue;
    const assigned=shifts.results.filter(s=>s.department===department&&(s.work_date===date?s.start<=hour&&s.end>hour:s.end>hour+24)).length;
    const required=plan.get(department+'|'+hour);
    slots.push({department,hour,required:required===undefined?null:required,assigned,shortage:required===undefined?null:Math.max(0,required-assigned)});
  }
  return {date,slots};
}

export default {async fetch(request,env){const url=new URL(request.url),path=url.pathname;
if(path==='/manifest.webmanifest')return new Response(JSON.stringify(manifest),{headers:{...securityHeaders,'content-type':'application/manifest+json; charset=utf-8','cache-control':'public, max-age=3600'}});
if(path==='/sw.js')return new Response(serviceWorker,{headers:{...securityHeaders,'content-type':'text/javascript; charset=utf-8','cache-control':'no-cache','service-worker-allowed':'/'}});
if(path==='/icon.svg')return new Response(appIcon,{headers:{...securityHeaders,'content-type':'image/svg+xml; charset=utf-8','cache-control':'public, max-age=86400'}});
if(path==='/icon-192.png')return pngResponse(icon192);
if(path==='/icon-512.png')return pngResponse(icon512);
// Readiness means the database migrations are present and an enabled manager can sign in with a password.
// A 200 does not prove that the upstream hosting gateway allows access from employee devices.
if(path==='/healthz'&&request.method==='GET'){
  if(!env.DB)return json({ready:false},503);
  try{
    await env.DB.prepare('SELECT must_change_password FROM password_accounts LIMIT 1').first();
    await env.DB.prepare('SELECT department FROM shifts LIMIT 1').first();
    await env.DB.prepare('SELECT status FROM shift_offers LIMIT 1').first();
    await env.DB.prepare('SELECT department FROM department_needs LIMIT 1').first();
    const manager=await env.DB.prepare("SELECT m.user_id FROM members m JOIN password_accounts p ON p.user_id=m.user_id WHERE m.role='manager' AND m.enabled=1 LIMIT 1").first();
    return json({ready:!!manager},manager?200:503);
  }catch{return json({ready:false},503)}
}
if(!env.DB)return fail('Хранилище недоступно',503);
const db=env.DB;
if(request.method==='POST'&&(request.headers.get('origin')&&request.headers.get('origin')!==url.origin||request.headers.get('sec-fetch-site')==='cross-site'))return fail('Запрос из другого источника запрещён',403);
if(path==='/api/auth/login'&&request.method==='POST')return loginByPassword(db,request);
const session=await loggedInSession(db,request);
if(path==='/api/auth/logout'&&request.method==='POST'){
  if(session)await db.prepare('DELETE FROM password_sessions WHERE token_hash=?').bind(session.tokenHash).run();
  return new Response(JSON.stringify({ok:true}),{headers:{...securityHeaders,'content-type':'application/json','set-cookie':cookieValue('',0),'cache-control':'no-store'}});
}
if(path==='/api/auth/change-password'&&request.method==='POST'){
  if(!session)return fail('Требуется вход',401);
  let a;try{a=await request.json()}catch{return fail('Неверные данные')}
  if(!validPassword(a.newPassword)||typeof a.currentPassword!=='string'||a.currentPassword.length>128)return fail('Новый пароль должен содержать от 12 до 128 символов');
  const account=await db.prepare('SELECT username,salt,password_hash FROM password_accounts WHERE user_id=?').bind(session.id).first();
  if(!account||await hashPassword(a.currentPassword,account.salt)!==account.password_hash)return fail('Текущий пароль указан неверно',403);
  if(a.currentPassword===a.newPassword)return fail('Новый пароль должен отличаться от временного');
  const salt=randomHex(16),digest=await hashPassword(a.newPassword,salt),now=moscowNowIso();
  await db.prepare('UPDATE password_accounts SET salt=?,password_hash=?,changed_at=?,must_change_password=0 WHERE user_id=?').bind(salt,digest,now,session.id).run();
  await db.prepare('DELETE FROM password_sessions WHERE user_id=? AND token_hash<>?').bind(session.id,session.tokenHash).run();
  await audit(db,session.id,session.id,'password_changed',null);
  return json({ok:true});
}
const trustedSso=env.TRUST_OAI_HEADERS==='true';
if(path==='/')return new Response(session?.member.mustChangePassword?changePasswordPage:session||trustedSso&&request.headers.get('oai-authenticated-user-id')?page:withPwa(loginPage.replace('Логин и временный пароль выдаёт руководитель','Логин и пароль выдаёт руководитель')),{headers:{...securityHeaders,'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
if(!path.startsWith('/api/'))return new Response('Not found',{status:404});
const id=session?.id||(trustedSso?request.headers.get('oai-authenticated-user-id'):null);
if(!id)return fail('Требуется вход',401);
if(session?.member.mustChangePassword)return fail('Сначала замените временный пароль',428);
if(!env.MANAGER_EMAIL&&!session)return fail('Руководитель не настроен',503);
const date=request.method==='GET'?url.searchParams.get('date'):null;
const email=(request.headers.get('oai-authenticated-user-email')||'').slice(0,200),rawName=request.headers.get('oai-authenticated-user-full-name')||'';
let displayName=rawName;try{if(request.headers.get('oai-authenticated-user-full-name-encoding')==='percent-encoded-utf-8')displayName=decodeURIComponent(rawName)}catch{displayName=''}
const m=session?session.member:await getMember(db,id,email,(displayName.trim()||email||'Сотрудник').slice(0,80),env.MANAGER_EMAIL);if(m.role==='blocked')return fail('Учётная запись отключена',403);if(path==='/api/shift-market'&&request.method==='GET')return json(await market(db,id,m.role));
if(path==='/api/admin/users'&&request.method==='GET'){if(m.role!=='manager')return fail('Только руководитель',403);return json(await listUsers(db))}
if(path==='/api/admin/roster'&&request.method==='POST'){
  if(m.role!=='manager')return fail('Только руководитель',403);
  let a;try{a=await request.json()}catch{return fail('Неверные данные')}
  if(!Array.isArray(a.people)||a.people.length<1||a.people.length>100)return fail('Нужен список от 1 до 100 сотрудников');
  const names=new Set();
  for(const person of a.people){
    if(typeof person?.name!=='string'||person.name.trim().length<2||person.name.trim().length>80||!DEPARTMENT_CODES.slice(0,4).includes(person.department)||typeof person.universal!=='boolean')return fail('Проверьте имена, отделы и допуски');
    const key=person.name.trim().toLowerCase();if(names.has(key))return fail('Повторяется имя сотрудника: '+person.name);names.add(key);
  }
  const results=await db.batch(a.people.map((person,i)=>db.prepare("INSERT INTO members(user_id,name,role,department,universal,enabled) VALUES(?,?,'employee',?,?,1) ON CONFLICT(user_id) DO NOTHING").bind('prototype-'+String(i+1).padStart(3,'0'),person.name.trim(),person.department,person.universal?1:0)));
  const added=results.reduce((sum,result)=>sum+(result.meta?.changes||0),0);
  await audit(db,id,id,'roster_imported',null,{added,total:a.people.length});
  return json({ok:true,added,total:a.people.length});
}
if(path==='/api/department-coverage'&&request.method==='GET'){const day=url.searchParams.get('date');if(!validDate(day))return fail('Укажите дату');return json(await deptCoverage(db,day))}
if(path==='/api/admin/users'&&request.method==='POST'){
  if(m.role!=='manager')return fail('Только руководитель',403);
  let a;try{a=await request.json()}catch{return fail('Неверные данные')}
  const username=String(a.username||'').toLowerCase().trim(),name=String(a.name||'').trim(),department=a.department,universal=a.universal===true;
  if(!validLogin(username)||!validPassword(a.password)||name.length<2||name.length>80||!DEPARTMENT_CODES.slice(0,4).includes(department))return fail('Введите имя, отдел, логин и пароль от 12 символов');
  const duplicate=await db.prepare('SELECT username FROM password_accounts WHERE username=?').bind(username).first();if(duplicate)return fail('Этот логин занят',409);
  const idNew='staff-'+randomHex(12);
  await db.prepare("INSERT INTO members(user_id,name,role,department,universal,enabled) VALUES(?,?,'employee',?,?,1)").bind(idNew,name,department,universal?1:0).run();
  if(!await upsertPassword(db,idNew,username,a.password,false))return fail('Не удалось создать пароль',409);
  await audit(db,id,idNew,'staff_created',null,{department,universal});
  return json({ok:true,id:idNew});
}
if(path==='/api/admin/password'&&request.method==='POST'){
  if(m.role!=='manager')return fail('Только руководитель',403);
  let a;try{a=await request.json()}catch{return fail('Неверные данные')}
  const userId=typeof a.userId==='string'?a.userId:id;
  const target=await db.prepare('SELECT user_id,role FROM members WHERE user_id=?').bind(userId).first();
  if(!target||target.role==='manager'&&target.user_id!==id)return fail('Нельзя изменить чужой аккаунт руководителя',403);
  if(!await upsertPassword(db,userId,String(a.username||'').trim().toLowerCase(),a.password,false))return fail('Логин занят или ненадёжный пароль');
  await audit(db,id,userId,'password_changed',null);
  return json({ok:true});
}
if(path==='/api/admin/staff'&&request.method==='POST'){
  if(m.role!=='manager')return fail('Только руководитель',403);
  let a;try{a=await request.json()}catch{return fail('Неверные данные')}
  if(typeof a.userId!=='string'||!DEPARTMENT_CODES.slice(0,4).includes(a.department)||typeof a.universal!=='boolean'||typeof a.enabled!=='boolean')return fail('Некорректные настройки сотрудника');
  const target=await db.prepare("SELECT role FROM members WHERE user_id=?").bind(a.userId).first();
  if(!target||target.role!=='employee')return fail('Изменять можно только сотрудников',403);
  await db.prepare('UPDATE members SET department=?,universal=?,enabled=? WHERE user_id=?').bind(a.department,a.universal?1:0,a.enabled?1:0,a.userId).run();
  if(!a.enabled)await db.prepare('DELETE FROM password_sessions WHERE user_id=?').bind(a.userId).run();
  await audit(db,id,a.userId,'staff_updated',null,{department:a.department,universal:a.universal,enabled:a.enabled});
  return json({ok:true});
}
if(path==='/api/schedule'&&request.method==='GET'){const start=url.searchParams.get('start');if(!validDate(start))return fail('Укажите дату начала');const r=await schedule(db,start);return json(m.role==='manager'?r:{dates:r.dates,people:r.people.map(p=>({name:p.userId===id?p.name:'Сотрудник',days:Object.fromEntries(Object.entries(p.days).filter(([date,x])=>x.status==='approved'||p.userId===id))})).filter(p=>Object.keys(p.days).length)})}if(path==='/api/history'&&request.method==='GET'){const start=url.searchParams.get('start');if(!validDate(start))return fail('Укажите дату начала');return json(await history(db,start,id,m.role))}if(path==='/api/week'&&request.method==='GET'){if(m.role!=='manager')return fail('Только руководитель может видеть обзор',403);const start=url.searchParams.get('start');if(!validDate(start))return fail('Укажите дату начала');return json(await week(db,start))}if(path==='/api/state'&&request.method==='GET'){if(!validDate(date))return fail('Укажите дату');const details=await extendedState(db,id,m,date);details.authMethod=session?'password':'sso';return json(details)}if(path==='/api/corrections'&&request.method==='GET')return json(await corrections(db,id,m.role));if(path==='/api/notifications'&&request.method==='GET')return json(await notifications(db,id));if(path==='/api/audit'&&request.method==='GET'){if(m.role!=='manager')return fail('Только руководитель',403);return json(await auditTrail(db))}if(path==='/api/attention'&&request.method==='GET'){if(m.role!=='manager')return fail('Только руководитель',403);return json(await attention(db,moscowToday()))}if(path!=='/api/action'||request.method!=='POST')return fail('Не найдено',404);let a;try{a=await request.json()}catch{return fail('Неверный JSON')}if(!a||typeof a.type!=='string'||!validDate(a.date))return fail('Неверное действие или дата');const workDate=a.date,today=moscowToday();
if(a.type==='rotateAttendanceCode'){if(m.role!=='manager')return fail('Только руководитель может обновить код точки',403);if(workDate!==today)return fail('Код выдаётся только на сегодня');const digits=new Uint32Array(1),saltBytes=new Uint8Array(16);crypto.getRandomValues(digits);crypto.getRandomValues(saltBytes);const code=String(digits[0]%1000000).padStart(6,'0'),salt=hex(saltBytes),expiresAt=new Date(Date.now()+4*3600000).toISOString();await db.prepare('INSERT INTO attendance_codes(work_date,code_hash,expires_at,created_by,created_at) VALUES(?,?,?,?,?) ON CONFLICT(work_date) DO UPDATE SET code_hash=excluded.code_hash,expires_at=excluded.expires_at,created_by=excluded.created_by,created_at=excluded.created_at').bind(workDate,`${salt}:${await hashCode(salt,code)}`,expiresAt,id,new Date().toISOString()).run();await audit(db,id,null,'code_rotated',workDate,{expiresAt});return json({ok:true,code,expiresAt})}
if(a.type==='markNotificationsRead'){await db.prepare('UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL').bind(new Date().toISOString(),id).run();return json({ok:true})}
if(a.type==='reviewShortShift'){if(m.role!=='manager')return fail('Только руководитель может рассмотреть короткую смену',403);if(typeof a.userId!=='string'||!['accepted','disputed'].includes(a.decision))return fail('Неверное решение');const note=typeof a.note==='string'?a.note.trim():'';if(a.decision==='disputed'&&(note.length<3||note.length>200))return fail('Укажите причину несогласия');const s=await db.prepare('SELECT in_at,out_at,short_review_status FROM shifts WHERE user_id=? AND work_date=?').bind(a.userId,workDate).first();if(!s?.in_at||!s.out_at||new Date(s.out_at)-new Date(s.in_at)>=5*3600000||s.short_review_status)return fail('Короткая смена уже обработана или не найдена',409);const r=await db.prepare('UPDATE shifts SET short_review_status=?,short_review_by=?,short_review_at=?,short_review_note=? WHERE user_id=? AND work_date=? AND short_review_status IS NULL AND out_at IS NOT NULL').bind(a.decision,id,new Date().toISOString(),note||null,a.userId,workDate).run();if(!r.meta.changes)return fail('Смена уже обработана',409);await notifyUser(db,a.userId,a.decision==='accepted'?`Короткая смена ${workDate} согласована руководителем`:`Короткая смена ${workDate} оспорена: ${note}`);await audit(db,id,a.userId,'short_shift_reviewed',workDate,{decision:a.decision,note});return json({ok:true})}
if(a.type==='setAvailability'||a.type==='clearAvailability'){if(workDate<today)return fail('Доступность на прошедший день нельзя менять');const shift=await db.prepare("SELECT start,end FROM shifts WHERE user_id=? AND work_date=? AND status IN ('pending','approved')").bind(id,workDate).first();if(a.type==='clearAvailability'){await db.prepare('DELETE FROM availability WHERE user_id=? AND work_date=?').bind(id,workDate).run();return json({ok:true})}if(!['available','unavailable'].includes(a.status))return fail('Укажите доступность');if(a.status==='available'&&(!Number.isInteger(a.start)||!Number.isInteger(a.end)||a.start<0||a.start>23||a.end>34||a.end-a.start<1))return fail('Укажите доступность на интервал от одного часа');if(shift&&(a.status==='unavailable'||a.start>shift.start||a.end<shift.end))return fail('Сначала отмените заявку или сохраните доступность на всю смену',409);await db.prepare('INSERT INTO availability(user_id,work_date,status,start,end,updated_at) VALUES(?,?,?,?,?,?) ON CONFLICT(user_id,work_date) DO UPDATE SET status=excluded.status,start=excluded.start,end=excluded.end,updated_at=excluded.updated_at').bind(id,workDate,a.status,a.status==='available'?a.start:null,a.status==='available'?a.end:null,new Date().toISOString()).run();return json({ok:true})}
if(a.type==='requestCorrection'){if(workDate>today)return fail('Исправление возможно после дня смены');if(!['in','out'].includes(a.kind)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(a.time||''))return fail('Укажите отметку и время');const reason=typeof a.reason==='string'?a.reason.trim():'';if(reason.length<3||reason.length>200)return fail('Укажите причину: от 3 до 200 символов');const shift=await db.prepare('SELECT in_at,out_at,status FROM shifts WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(!shift||shift.status!=='approved')return fail('Нужна подтверждённая смена',409);if((a.kind==='in'&&shift.in_at)||(a.kind==='out'&&shift.out_at))return fail('Эта отметка уже есть',409);if(a.kind==='out'&&!shift.in_at)return fail('Сначала запросите исправление прихода',409);const proposed=new Date(`${workDate}T${a.time}:00+03:00`).toISOString();if(new Date(proposed)>new Date()||(a.kind==='in'&&shift.out_at&&proposed>=shift.out_at)||(a.kind==='out'&&proposed<=shift.in_at))return fail('Проверьте порядок и дату отметок');const existing=await db.prepare("SELECT id FROM time_corrections WHERE user_id=? AND work_date=? AND kind=? AND status='pending'").bind(id,workDate,a.kind).first();if(existing)return fail('Запрос на эту отметку уже ожидает решения',409);await db.prepare('INSERT INTO time_corrections(user_id,work_date,kind,proposed_at,reason,created_at) VALUES(?,?,?,?,?,?)').bind(id,workDate,a.kind,proposed,reason,new Date().toISOString()).run();await log(db,`${m.name} запросил исправление отметки`);await notifyManagers(db,`${m.name} запросил исправление ${a.kind==='in'?'прихода':'ухода'} за ${workDate}`);await audit(db,id,id,'correction_requested',workDate,{kind:a.kind,time:proposed,reason});return json({ok:true})}
if(a.type==='reviewCorrection'){
  if(m.role!=='manager')return fail('Только руководитель может согласовать исправление',403);
  if(!Number.isInteger(a.correctionId)||!['approve','reject'].includes(a.decision))return fail('Неверное решение');
  const c=await db.prepare("SELECT * FROM time_corrections WHERE id=? AND status='pending'").bind(a.correctionId).first();
  if(!c)return fail('Запрос уже обработан',409);
  let short=false;
  if(a.decision==='approve'){
    if(c.proposed_at>new Date().toISOString())return fail('Будущую отметку нельзя подтвердить',409);
    const s=await db.prepare('SELECT in_at,out_at,status FROM shifts WHERE user_id=? AND work_date=?').bind(c.user_id,c.work_date).first();
    if(!s||s.status!=='approved')return fail('Смена уже изменилась',409);
    let update;
    if(c.kind==='in'){
      if(s.in_at||(s.out_at&&c.proposed_at>=s.out_at))return fail('Приход уже есть или время неверно',409);
      update=db.prepare("UPDATE shifts SET in_at=? WHERE user_id=? AND work_date=? AND status='approved' AND in_at IS NULL AND (out_at IS NULL OR out_at>?)").bind(c.proposed_at,c.user_id,c.work_date,c.proposed_at);
    }else{
      if(!s.in_at||s.out_at||c.proposed_at<=s.in_at)return fail('Уход уже есть или время неверно',409);
      short=new Date(c.proposed_at)-new Date(s.in_at)<5*3600000;
      update=db.prepare("UPDATE shifts SET out_at=?,short_reason=? WHERE user_id=? AND work_date=? AND status='approved' AND in_at IS NOT NULL AND in_at<? AND out_at IS NULL").bind(c.proposed_at,short?c.reason:null,c.user_id,c.work_date,c.proposed_at);
    }
    const result=await db.batch([update,db.prepare("UPDATE time_corrections SET status='approved',reviewer_id=?,reviewed_at=? WHERE id=? AND status='pending' AND EXISTS(SELECT 1 FROM shifts WHERE user_id=? AND work_date=? AND "+(c.kind==='in'?'in_at':'out_at')+"=?)").bind(id,new Date().toISOString(),c.id,c.user_id,c.work_date,c.proposed_at)]);
    if(!result[0].meta.changes||!result[1].meta.changes)return fail('Смена уже изменилась',409);
  }else{
    const result=await db.prepare("UPDATE time_corrections SET status='rejected',reviewer_id=?,reviewed_at=? WHERE id=? AND status='pending'").bind(id,new Date().toISOString(),c.id).run();
    if(!result.meta.changes)return fail('Запрос уже обработан',409);
  }
  await notifyUser(db,c.user_id,a.decision==='approve'?`Исправление ${c.kind==='in'?'прихода':'ухода'} за ${c.work_date} подтверждено`:`Исправление отметки за ${c.work_date} отклонено`);
  if(short)await notifyManagers(db,`Короткая смена ${c.work_date} ожидает проверки`);
  await audit(db,id,c.user_id,'correction_reviewed',c.work_date,{kind:c.kind,decision:a.decision,time:c.proposed_at,short});
  await log(db,`Руководитель ${a.decision==='approve'?'подтвердил':'отклонил'} исправление отметки`);
  return json({ok:true});
}
if(a.type==='offerShift'){
 if(workDate<today)return fail('Нельзя выставлять прошедшие смены');
 const owner=a.userId&&m.role==='manager'?a.userId:id;
 const shift=await db.prepare("SELECT start,end,department,in_at FROM shifts WHERE user_id=? AND work_date=? AND status='approved'").bind(owner,workDate).first();
 if(!shift||shift.in_at)return fail('Можно выставлять только согласованную смену до начала работы',409);
 if(workDate===today&&shift.start*60<=moscowMinute())return fail('Смена уже началась',409);
 const now=moscowNowIso();
 await db.prepare("INSERT INTO shift_offers(owner_id,work_date,status,volunteer_id,created_at,updated_at) VALUES(?,?,'open',NULL,?,?) ON CONFLICT(owner_id,work_date) DO UPDATE SET status='open',volunteer_id=NULL,updated_at=excluded.updated_at").bind(owner,workDate,now,now).run();
 await notifyManagers(db,'Открыта смена на бирже: '+workDate+', '+shift.department);
 await audit(db,id,owner,'shift_offered',workDate,{department:shift.department,start:shift.start,end:shift.end});
 return json({ok:true});
}
if(a.type==='withdrawOffer'){
 const offer=await db.prepare("SELECT owner_id FROM shift_offers WHERE id=? AND status IN ('open','claimed')").bind(a.offerId).first();
 if(!offer)return fail('Предложение уже закрыто',409);
 if(offer.owner_id!==id&&m.role!=='manager')return fail('Нельзя удалить чужое предложение',403);
 await db.prepare("UPDATE shift_offers SET status='cancelled',updated_at=? WHERE id=?").bind(moscowNowIso(),a.offerId).run();
 await audit(db,id,offer.owner_id,'shift_offer_cancelled',workDate);return json({ok:true});
}
if(a.type==='volunteerShift'){
 const offer=await db.prepare("SELECT o.id,o.owner_id,o.work_date,o.status,s.start,s.end,s.department FROM shift_offers o JOIN shifts s ON s.user_id=o.owner_id AND s.work_date=o.work_date WHERE o.id=? AND o.status='open'").bind(a.offerId).first();
 if(!offer||offer.work_date!==workDate)return fail('Смена уже недоступна',409);
 if(offer.owner_id===id)return fail('Нельзя взять собственную смену',400);
 if(offer.work_date===today&&offer.start*60<=moscowMinute())return fail('Смена уже начинается',409);
 const person=await db.prepare('SELECT department,universal,enabled FROM members WHERE user_id=?').bind(id).first();
 if(!person?.enabled||(offer.department!==person.department&&!person.universal)||(offer.department==='night'&&!person.universal))return fail('Нет допуска в отдел',403);
 const assigned=await db.prepare("SELECT user_id FROM shifts WHERE user_id=? AND work_date=? AND status IN ('pending','approved')").bind(id,workDate).first();
 if(assigned)return fail('На эту дату у вас уже есть смена или заявка',409);
 const av=await db.prepare('SELECT status,start,end FROM availability WHERE user_id=? AND work_date=?').bind(id,workDate).first();
 if(av&&(av.status==='unavailable'||av.start>offer.start||av.end<offer.end))return fail('Смена не совпадает с доступностью',409);
 const up=await db.prepare("UPDATE shift_offers SET volunteer_id=?,status='claimed',updated_at=? WHERE id=? AND status='open'").bind(id,moscowNowIso(),a.offerId).run();
 if(!up.meta.changes)return fail('Смену уже запросили',409);
 await notifyManagers(db,'Поступил отклик на открытую смену '+workDate);
 await audit(db,id,offer.owner_id,'shift_volunteer',workDate,{offerId:a.offerId});return json({ok:true});
}
if(a.type==='reviewShiftOffer'){
 if(m.role!=='manager')return fail('Только руководитель подтверждает замену',403);
 if(!['approve','reject'].includes(a.decision))return fail('Выберите решение');
 const offer=await db.prepare("SELECT o.id,o.owner_id,o.work_date,o.volunteer_id,s.start,s.end,s.department,s.in_at FROM shift_offers o JOIN shifts s ON s.user_id=o.owner_id AND s.work_date=o.work_date WHERE o.id=? AND o.status='claimed'").bind(a.offerId).first();
 if(!offer||offer.work_date!==workDate||!offer.volunteer_id||offer.in_at)return fail('Замена уже недоступна',409);
 const candidate=await db.prepare('SELECT department,universal,enabled FROM members WHERE user_id=?').bind(offer.volunteer_id).first();
 if(!candidate?.enabled||(offer.department!==candidate.department&&!candidate.universal)||(offer.department==='night'&&!candidate.universal))return fail('Доброволец больше не подходит по допуску',409);
 const av=await db.prepare('SELECT status,start,end FROM availability WHERE user_id=? AND work_date=?').bind(offer.volunteer_id,workDate).first();
 if(av&&(av.status==='unavailable'||av.start>offer.start||av.end<offer.end))return fail('Доброволец недоступен',409);
 const busy=await db.prepare("SELECT user_id FROM shifts WHERE user_id=? AND work_date=? AND status IN ('pending','approved')").bind(offer.volunteer_id,workDate).first();
 if(a.decision==='approve'&&busy)return fail('Доброволец уже занял другую смену',409);
 if(a.decision==='reject'){
   await db.prepare("UPDATE shift_offers SET volunteer_id=NULL,status='open',updated_at=? WHERE id=? AND status='claimed'").bind(moscowNowIso(),offer.id).run();
   await notifyUser(db,offer.volunteer_id,'Запрос замены на '+workDate+' не согласован');
 }else{
   const changes=await db.batch([
     db.prepare("UPDATE shifts SET user_id=? WHERE user_id=? AND work_date=? AND status='approved' AND in_at IS NULL").bind(offer.volunteer_id,offer.owner_id,workDate),
     db.prepare("UPDATE shift_offers SET status='closed',updated_at=? WHERE id=? AND status='claimed'").bind(moscowNowIso(),offer.id)
   ]);
   if(!changes[0].meta.changes||!changes[1].meta.changes)return fail('Смена уже изменилась',409);
   await notifyUser(db,offer.volunteer_id,'Вы получили смену '+workDate);
   await notifyUser(db,offer.owner_id,'Ваша смена '+workDate+' передана другому сотруднику');
 }
 await audit(db,id,offer.volunteer_id,'shift_offer_reviewed',workDate,{offerId:offer.id,decision:a.decision});
 return json({ok:true});
}
if(a.type==='setDepartmentNeed'){
  if(m.role!=='manager')return fail('Только руководитель может менять потребность',403);
  if(!DEPARTMENT_CODES.includes(a.department)||!Number.isInteger(a.hour)||a.hour<0||a.hour>23||!Number.isInteger(a.count)||a.count<0||a.count>50)return fail('Некорректная потребность');
  if(a.department==='night'&&a.hour>=8&&a.hour<22||a.department!=='night'&&(a.hour<8||a.hour>=22))return fail('Час не соответствует режиму отдела');
  await db.prepare('INSERT INTO department_needs(work_date,hour,department,count) VALUES(?,?,?,?) ON CONFLICT(work_date,hour,department) DO UPDATE SET count=excluded.count').bind(workDate,a.hour,a.department,a.count).run();
  await audit(db,id,null,'department_need_changed',workDate,{department:a.department,hour:a.hour,count:a.count});
  return json({ok:true});
}
if(a.type==='setNeed'){if(m.role!=='manager')return fail('Только руководитель может менять потребность',403);if(!Number.isInteger(a.hour)||a.hour<8||a.hour>19||!Number.isInteger(a.count)||a.count<0||a.count>30)return fail('Неверное значение');await db.prepare('INSERT INTO needs(work_date,hour,count) VALUES(?,?,?) ON CONFLICT(work_date,hour) DO UPDATE SET count=excluded.count').bind(workDate,a.hour,a.count).run();await log(db,`Потребность на ${a.hour}:00: ${a.count} чел.`);await audit(db,id,null,'need_changed',workDate,{hour:a.hour,count:a.count});return json({ok:true})}
if(a.type==='setNeedRange'){if(m.role!=='manager')return fail('Только руководитель может менять потребность',403);if(!Number.isInteger(a.start)||!Number.isInteger(a.end)||a.start<8||a.end>20||a.end<=a.start||!Number.isInteger(a.count)||a.count<0||a.count>30)return fail('Укажите корректный интервал и число сотрудников');const stmt=db.prepare('INSERT INTO needs(work_date,hour,count) VALUES(?,?,?) ON CONFLICT(work_date,hour) DO UPDATE SET count=excluded.count');await db.batch(Array.from({length:a.end-a.start},(_,i)=>stmt.bind(workDate,a.start+i,a.count)));await log(db,`Потребность ${workDate}, ${a.start}:00–${a.end}:00: ${a.count} чел.`);await audit(db,id,null,'need_changed',workDate,{start:a.start,end:a.end,count:a.count});return json({ok:true})}
if(a.type==='copyNeeds'){if(m.role!=='manager')return fail('Только руководитель может менять потребность',403);if(!validDate(a.sourceDate)||a.sourceDate===workDate)return fail('Выберите другую исходную дату');const source=await state(db,id,m,a.sourceDate);const stmt=db.prepare('INSERT INTO needs(work_date,hour,count) VALUES(?,?,?) ON CONFLICT(work_date,hour) DO UPDATE SET count=excluded.count');await db.batch(source.state.need.map((count,i)=>stmt.bind(workDate,i+8,count)));await log(db,`Потребность скопирована с ${a.sourceDate} на ${workDate}`);await audit(db,id,null,'need_changed',workDate,{sourceDate:a.sourceDate});return json({ok:true})}
if(a.type==='book'){if(workDate<today)return fail('Нельзя отправить заявку на прошедший день');const department=a.department||m.department||'mix';if(!DEPARTMENT_CODES.includes(department))return fail('Выберите отдел');if(department!==m.department&&!m.universal)return fail('У вас нет допуска к этому отделу',403);if(department==='night'&&!m.universal)return fail('Для ночной смены требуется универсальный допуск',403);const validHours=Number.isInteger(a.start)&&Number.isInteger(a.end)&&a.end-a.start>=5&&a.end-a.start<=12&&(department==='night'?a.start>=20&&a.start<=23&&a.end>=24&&a.end<=34:a.start>=8&&a.end<=22);if(!validHours)return fail('Неверный интервал или длительность смены');if(workDate===today&&a.start*60<=moscowMinute())return fail('Начало интервала уже прошло. Выберите ближайший будущий час',409);const av=await db.prepare('SELECT status,start,end FROM availability WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(av&&(av.status==='unavailable'||av.start>a.start||av.end<a.end))return fail('Выбранное время не совпадает с вашей доступностью',409);const s=await db.prepare('SELECT in_at FROM shifts WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(s?.in_at)return fail('Сначала завершите текущую смену',409);await db.prepare("INSERT INTO shifts(user_id,work_date,start,end,in_at,out_at,status,department) VALUES(?,?,?,?,NULL,NULL,'pending',?) ON CONFLICT(user_id,work_date) DO UPDATE SET start=excluded.start,end=excluded.end,department=excluded.department,in_at=NULL,out_at=NULL,status='pending',rejection_reason=NULL,short_reason=NULL WHERE shifts.in_at IS NULL").bind(id,workDate,a.start,a.end,department).run();await log(db,`${m.name} выбрал интервал ${a.start}:00–${a.end}:00`);await notifyManagers(db,`${m.name} отправил заявку на ${workDate}, ${a.start}:00–${a.end}:00`);await audit(db,id,id,'shift_requested',workDate,{start:a.start,end:a.end});return json({ok:true})}
if(a.type==='approve'){if(m.role!=='manager')return fail('Только руководитель может согласовать заявку',403);const permission=await db.prepare('SELECT s.department,m.department AS main_department,m.universal,m.enabled FROM shifts s JOIN members m ON m.user_id=s.user_id WHERE s.user_id=? AND s.work_date=?').bind(a.userId,workDate).first();if(!permission||!permission.enabled||(permission.department!==permission.main_department&&!permission.universal)||(permission.department==='night'&&!permission.universal))return fail('У сотрудника нет допуска или доступ отключён',409);const av=await db.prepare('SELECT a.status,a.start,a.end,s.start AS shift_start,s.end AS shift_end FROM availability a JOIN shifts s ON s.user_id=a.user_id AND s.work_date=a.work_date WHERE a.user_id=? AND a.work_date=?').bind(a.userId,workDate).first();if(av&&(av.status==='unavailable'||av.start>av.shift_start||av.end<av.shift_end))return fail('Сотрудник отметил недоступность для этой смены',409)}
if(a.type==='approve'||a.type==='reject'){if(m.role!=='manager')return fail('Только руководитель может согласовать заявку',403);if(workDate<today)return fail('Нельзя согласовать прошедшую смену',409);if(typeof a.userId!=='string'||a.userId.length>200)return fail('Неверный сотрудник');if(a.type==='approve'&&workDate===today){const candidate=await db.prepare('SELECT start FROM shifts WHERE user_id=? AND work_date=?').bind(a.userId,workDate).first();if(candidate&&candidate.start*60<=moscowMinute())return fail('Начало смены уже прошло. Попросите сотрудника выбрать новое время',409)}const next=a.type==='approve'?'approved':'rejected',reason=typeof a.reason==='string'?a.reason.trim():'';if(next==='rejected'&&(reason.length<3||reason.length>200))return fail('Укажите причину отклонения: от 3 до 200 символов');const result=await db.prepare("UPDATE shifts SET status=?,rejection_reason=? WHERE user_id=? AND work_date=? AND status='pending' AND in_at IS NULL").bind(next,next==='rejected'?reason:null,a.userId,workDate).run();if(!result.meta.changes)return fail('Заявка уже обработана',409);await log(db,next==='approved'?'Руководитель подтвердил заявку':'Руководитель отклонил заявку');await notifyUser(db,a.userId,next==='approved'?`Заявка на ${workDate} подтверждена`:`Заявка на ${workDate} отклонена: ${reason}`);await audit(db,id,a.userId,next==='approved'?'shift_approved':'shift_rejected',workDate,{reason:next==='rejected'?reason:null});return json({ok:true})}if(a.type==='cancel'){const s=await db.prepare('SELECT in_at FROM shifts WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(!s)return fail('Смена не найдена',404);if(s.in_at)return fail('Отмеченную смену нельзя отменить',409);await db.prepare('DELETE FROM shifts WHERE user_id=? AND work_date=? AND in_at IS NULL').bind(id,workDate).run();await log(db,`${m.name} отменил интервал`);await audit(db,id,id,'shift_cancelled',workDate);return json({ok:true})}
if(a.type==='clockIn'&&workDate!==today)return fail('Приход доступен только в день смены',409);if(a.type==='clockIn'){const s=await db.prepare('SELECT in_at,status,start,end FROM shifts WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(!s||s.in_at||s.status!=='approved')return fail('Нужна подтверждённая заявка',409);if(moscowMinute()<s.start*60||moscowMinute()>=Math.min(1440,s.end*60))return fail('Приход можно отметить только в согласованный интервал',409);const codeError=await verifyAttendanceCode(db,id,today,a.code);if(codeError)return fail(codeError,409);const r=await db.prepare("UPDATE shifts SET in_at=? WHERE user_id=? AND work_date=? AND in_at IS NULL AND status='approved'").bind(new Date().toISOString(),id,workDate).run();if(!r.meta.changes)return fail('Обновите страницу',409);await log(db,`${m.name} отметил приход`);await audit(db,id,id,'clock_in',workDate,{verified:'code'});return json({ok:true})}
if(a.type==='clockOut'){const s=await db.prepare('SELECT in_at,out_at FROM shifts WHERE user_id=? AND work_date=?').bind(id,workDate).first();if(!s?.in_at||s.out_at)return fail('Нет открытой смены',409);if(workDate!==today&&addDays(workDate,1)!==today)return fail('Закрытие смены доступно до конца следующего дня',409);const now=new Date(),underFive=now-new Date(s.in_at)<5*3600000,reason=typeof a.reason==='string'?a.reason.trim():'';if(underFive&&(reason.length<3||reason.length>200))return fail('Укажите причину короткого выхода: от 3 до 200 символов');const codeError=await verifyAttendanceCode(db,id,today,a.code);if(codeError)return fail(codeError,409);const r=await db.prepare('UPDATE shifts SET out_at=?,short_reason=? WHERE user_id=? AND work_date=? AND in_at IS NOT NULL AND out_at IS NULL').bind(now.toISOString(),underFive?reason:null,id,workDate).run();if(!r.meta.changes)return fail('Обновите страницу',409);await log(db,`${m.name} отметил уход`);if(underFive)await notifyManagers(db,`${m.name} завершил смену ${workDate} раньше пяти часов: ${reason}`);await audit(db,id,id,'clock_out',workDate,{verified:'code',underFive,reason:underFive?reason:null});return json({ok:true})}
return fail('Неизвестное действие') }};

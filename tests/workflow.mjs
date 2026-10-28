import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync } from 'node:fs';
import { Script, runInNewContext } from 'node:vm';
const NativeDate = Date;
let clockIso = '2026-10-22T05:00:00.000Z'; // 08:00 МСК
globalThis.Date = class extends NativeDate {
  constructor(...args) { super(...(args.length ? args : [clockIso])); }
  static now() { return NativeDate.parse(clockIso); }
};

const html = readFileSync('worker/index.html', 'utf8');
const clientScript = readFileSync('worker/client.js', 'utf8');
assert.ok(clientScript, 'client script exists');
new Script(clientScript, { filename: 'client.js' });
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(x => x[1]);
assert.equal(ids.length, new Set(ids).size, 'HTML IDs are unique');
assert.match(html, /brand-logo/, 'redesigned shell is present');
assert.match(clientScript, /api\/schedule/, 'live schedule is loaded');
assert.doesNotMatch(clientScript, /login-manager|roleSwitch|_demo_/, 'demo role switching is absent');

// Upgrade the exact pre-pilot schema with retained rows before running the full clean-database workflow.
const upgradeDb = new DatabaseSync(':memory:');
for (const file of readdirSync('drizzle').filter(x => /^000[0-6]_.*\.sql$/.test(x)).sort()) {
  for (const statement of readFileSync('drizzle/' + file, 'utf8').split('--> statement-breakpoint')) if (statement.trim()) upgradeDb.exec(statement);
}
upgradeDb.prepare("INSERT INTO members(user_id,name,role) VALUES('existing','Существующий сотрудник','employee')").run();
upgradeDb.prepare("INSERT INTO shifts(user_id,work_date,start,end,status) VALUES('existing','2026-10-22',10,16,'approved')").run();
for (const file of readdirSync('drizzle').filter(x => /^000[7-9]_.*\.sql$/.test(x)).sort()) {
  for (const statement of readFileSync('drizzle/' + file, 'utf8').split('--> statement-breakpoint')) if (statement.trim()) upgradeDb.exec(statement);
}
const upgradedMember = upgradeDb.prepare("SELECT department,universal,enabled FROM members WHERE user_id='existing'").get();
assert.equal(upgradedMember.department, 'mix');
assert.equal(upgradedMember.universal, 0);
assert.equal(upgradedMember.enabled, 1);
assert.equal(upgradeDb.prepare("SELECT department FROM shifts WHERE user_id='existing'").get().department, 'mix');
assert.ok(upgradeDb.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='password_accounts'").get(), 'password tables exist after upgrade');
upgradeDb.close();

const db = new DatabaseSync(':memory:');
for (const file of readdirSync('drizzle').filter(x => x.endsWith('.sql')).sort()) {
  for (const statement of readFileSync('drizzle/' + file, 'utf8').split('--> statement-breakpoint')) {
    if (statement.trim()) db.exec(statement);
  }
}
const DB = {
  prepare(sql) {
    const prepared = db.prepare(sql);
    const statement = {
      args: [],
      bind(...args) { return { ...this, args }; },
      async first() { return prepared.get(...this.args); },
      async all() { return { results: prepared.all(...this.args) }; },
      async run() { return { meta: { changes: prepared.run(...this.args).changes } }; },
    };
    return statement;
  },
  async batch(statements) {
    db.exec('BEGIN');
    try {
      const result = [];
      for (const statement of statements) result.push(await statement.run());
      db.exec('COMMIT');
      return result;
    } catch (error) {
      db.exec('ROLLBACK');
      throw error;
    }
  },
};
const source = readFileSync('dist/server/index.js');
const { default: app } = await import('data:text/javascript;base64,' + source.toString('base64'));
const env = { DB, MANAGER_EMAIL: 'manager@example.com', TRUST_OAI_HEADERS: 'true' };
const manager = 'manager@example.com', employee = 'employee@example.com', colleague = 'colleague@example.com';
const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Moscow', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const tomorrow = new Date(Date.parse(today) + 86400000).toISOString().slice(0, 10);
const yesterday = new Date(Date.parse(today) - 86400000).toISOString().slice(0, 10);
async function call(email, method, path, body) {
  const request = new Request('https://example.test' + path, {
    method,
    headers: { 'oai-authenticated-user-id': email, 'oai-authenticated-user-email': email, ...(body ? { 'content-type': 'application/json' } : {}) },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  return app.fetch(request, env);
}
const view = async (email, date = today) => (await call(email, 'GET', '/api/state?date=' + date)).json();
const action = (email, type, date = today, details = {}) => call(email, 'POST', '/api/action', { type, date, ...details });
const login = await app.fetch(new Request('https://example.test/'), env);
assert.match(await login.text(), /Войти в личный кабинет/);
assert.match(login.headers.get('content-security-policy'), /frame-ancestors 'none'/, 'HTML has security headers');
const manifestResponse = await app.fetch(new Request('https://example.test/manifest.webmanifest'), env);
const manifest = await manifestResponse.json();
assert.equal(manifest.display, 'standalone', 'PWA opens without browser chrome');
assert.equal(manifest.start_url, '/');
assert.match(await (await app.fetch(new Request('https://example.test/sw.js'), env)).text(), /clients\.claim/, 'service worker is served');
assert.match(await (await call(employee, 'GET', '/')).text(), /Личный кабинет/);
assert.equal((await app.fetch(new Request('https://example.test/api/state?date=' + today), env)).status, 401);
const health = () => app.fetch(new Request('https://example.test/healthz'),env);
assert.equal((await health()).status,503,'no manager password means not ready to pilot');
assert.deepEqual(await (await health()).json(),{ready:false});
assert.equal((await app.fetch(new Request('https://example.test/healthz'),{...env,DB:null})).status,503,'missing D1 is not ready');

assert.equal((await view(employee)).role, 'employee', 'first visitor must not become manager');
assert.equal((await view(manager)).role, 'manager');
assert.deepEqual((await view(manager)).state.need, Array(12).fill(0), 'unset demand must not invent staffing targets');
assert.deepEqual((await view(manager)).state.needConfigured, Array(12).fill(false));
assert.equal((await (await call(manager, 'GET', '/api/week?start=' + today)).json()).days[0].coverage, null);
assert.equal((await action(employee, 'rotateAttendanceCode')).status, 403);
const codeResponse = await action(manager, 'rotateAttendanceCode');
assert.equal(codeResponse.status, 200);
const attendanceCode = (await codeResponse.json()).code;
assert.match(attendanceCode, /^\d{6}$/);
assert.equal((await view(manager)).email, manager);
const named = await app.fetch(new Request('https://example.test/api/state?date=' + today, { headers: {
  'oai-authenticated-user-id': manager,
  'oai-authenticated-user-email': manager,
  'oai-authenticated-user-full-name': encodeURIComponent('Иван Артемьев'),
  'oai-authenticated-user-full-name-encoding': 'percent-encoded-utf-8',
} }), env);
assert.equal((await named.json()).name, 'Иван Артемьев', 'profile uses signed-in display name');
assert.equal((await view(manager)).role, 'manager', 'role still follows email');
assert.equal((await health()).status,503,'SSO by itself is not enough for password-only pilots');
assert.equal((await call(manager,'POST','/api/admin/password',{username:'pilot.manager',password:'SecureManager2026!'})).status,200,'manager sets password while trusted SSO is available');
assert.equal((await health()).status,200,'D1 migrations and password-enabled manager are ready');
assert.deepEqual(await (await health()).json(),{ready:true});
// Simulate the 100,000-iteration cap enforced by production Cloudflare Workers.
const originalCryptoDescriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
const originalCrypto=globalThis.crypto;
const originalSubtle=originalCrypto.subtle;
Object.defineProperty(globalThis,'crypto',{configurable:true,value:{
  getRandomValues:originalCrypto.getRandomValues.bind(originalCrypto),
  subtle:{
    importKey:originalSubtle.importKey.bind(originalSubtle),
    digest:originalSubtle.digest.bind(originalSubtle),
    deriveBits:async (params,...args)=>{
      if(params?.name==='PBKDF2'&&params.iterations>100000)throw Error('Pbkdf2 failed: iteration counts above 100000 are not supported (requested 180000).');
      return originalSubtle.deriveBits(params,...args);
    }
  }
}});
let managerPasswordLogin;
try{
  managerPasswordLogin=await app.fetch(new Request('https://example.test/api/auth/login',{
    method:'POST',headers:{'content-type':'application/json'},
    body:JSON.stringify({username:'pilot.manager',password:'SecureManager2026!'})
  }),{...env,TRUST_OAI_HEADERS:'false'});
}finally{
  if(originalCryptoDescriptor)Object.defineProperty(globalThis,'crypto',originalCryptoDescriptor);
  else delete globalThis.crypto;
}
assert.equal(managerPasswordLogin.status,200,'manager can log in without ChatGPT SSO');
const managerCookie=managerPasswordLogin.headers.get('set-cookie').split(';')[0];
const managerPasswordAdmin=await app.fetch(new Request('https://example.test/api/admin/users',{headers:{cookie:managerCookie}}),{...env,TRUST_OAI_HEADERS:'false'});
assert.equal(managerPasswordAdmin.status,200,'manager has admin rights with password-only session');
assert.ok((await managerPasswordAdmin.json()).users.some(u=>u.role==='manager'&&u.username==='pilot.manager'));
await view(colleague);
assert.equal((await action(employee, 'setNeed', today, { hour: 12, count: 4 })).status, 403);
assert.equal((await action(manager, 'setNeedRange', today, { start: 12, end: 16, count: 6 })).status, 200);
assert.deepEqual((await view(manager)).state.need.slice(4, 8), [6, 6, 6, 6]);
assert.deepEqual((await view(manager)).state.needConfigured.slice(4, 8), [true, true, true, true]);
assert.equal((await action(employee, 'copyNeeds', tomorrow, { sourceDate: today })).status, 403);
assert.equal((await action(manager, 'copyNeeds', tomorrow, { sourceDate: today })).status, 200);
assert.deepEqual((await view(manager, tomorrow)).state.need, (await view(manager)).state.need);
assert.equal((await action(employee, 'book', today, { start: 9, end: 13 })).status, 400);
assert.equal((await action(employee, 'book', yesterday, { start: 10, end: 16 })).status, 400, 'past booking blocked');
assert.equal((await action(employee, 'book', '2026-02-30', { start: 10, end: 16 })).status, 400, 'invalid date blocked');
assert.equal((await action(employee, 'book', today, { start: 10, end: 16 })).status, 200);
assert.equal((await view(manager)).pending.length, 1);
assert.equal((await view(manager)).state.people.length, 0, 'pending does not close coverage');
assert.equal((await action(employee, 'clockIn')).status, 409);
assert.equal((await action(employee, 'approve', today, { userId: employee })).status, 403);
assert.equal((await action(manager, 'reject', today, { userId: employee, reason: ' ' })).status, 400);
assert.equal((await action(manager, 'reject', today, { userId: employee, reason: 'Нужна другая часть дня' })).status, 200);
assert.match((await view(employee)).state.my.rejectionReason, /другая часть/);
assert.equal((await action(employee, 'book', today, { start: 11, end: 17 })).status, 200);
assert.equal((await action(manager, 'approve', today, { userId: employee })).status, 200);
assert.equal((await action(manager, 'approve', today, { userId: employee })).status, 409);
assert.equal((await view(manager)).state.people.length, 1);
assert.equal((await call(employee, 'GET', '/api/schedule?start=' + today)).status, 200, 'employees see the team schedule');
const schedule = await (await call(manager, 'GET', '/api/schedule?start=' + today)).json();
assert.equal(schedule.dates.length, 7);
assert.equal(schedule.people[0].days[today].status, 'approved');
clockIso = '2026-10-22T08:05:00.000Z'; // 11:05 МСК, смена 11–17
assert.equal((await action(employee, 'clockIn', today, { code: '000000' })).status, 409);
assert.equal((await action(employee, 'clockIn', today, { code: attendanceCode })).status, 200);
clockIso = '2026-10-22T08:10:00.000Z';
assert.equal((await action(employee, 'clockOut')).status, 400, 'early exit needs a reason');
assert.equal((await action(employee, 'clockOut', today, { reason: 'Срочный вопрос', code: attendanceCode })).status, 200);
assert.equal((await view(manager)).team[0].status, 'Меньше 5 часов');
assert.equal((await view(employee)).state.attendance.shortReason, 'Срочный вопрос');
assert.equal((await view(employee)).state.attendance.reviewStatus, null);
assert.equal((await (await call(manager, 'GET', '/api/attention')).json()).short.length, 1);
assert.equal((await action(employee, 'reviewShortShift', today, { userId: employee, decision: 'accepted' })).status, 403);
assert.equal((await action(manager, 'reviewShortShift', today, { userId: employee, decision: 'accepted' })).status, 200);
assert.equal((await view(employee)).state.attendance.reviewStatus, 'accepted');
assert.equal((await (await call(manager, 'GET', '/api/attention')).json()).short.length, 0);
assert.equal((await action(manager, 'reviewShortShift', today, { userId: employee, decision: 'accepted' })).status, 409);
const unrelated = await view(colleague);
assert.equal(unrelated.team, undefined);
assert.deepEqual(unrelated.state.events, []);
assert.equal(JSON.stringify(unrelated).includes('Срочный вопрос'), false);
assert.equal((await view(manager, tomorrow)).team.length, 0, 'copy does not move shifts');
assert.equal((await call(employee, 'GET', '/api/week?start=' + today)).status, 403);
assert.equal((await call(manager, 'GET', '/api/week?start=2026-02-30')).status, 400);
const week = await (await call(manager, 'GET', '/api/week?start=' + today)).json();
assert.equal(week.days.length, 7);
assert.equal(week.days[0].approved, 1);
assert.equal(week.days[0].pending, 0);
assert.equal(week.days[1].approved, 0, 'copied demand does not copy approved shifts');
const ownHistory = await (await call(employee, 'GET', '/api/history?start=' + today)).json();
const otherHistory = await (await call(colleague, 'GET', '/api/history?start=' + today)).json();
const managerHistory = await (await call(manager, 'GET', '/api/history?start=' + today)).json();
assert.equal(ownHistory.rows.length, 1);
assert.equal(ownHistory.rows[0].reason, 'Срочный вопрос');
assert.equal(otherHistory.rows.length, 0, 'employees cannot view others history');
assert.equal(otherHistory.people, undefined);
assert.equal(managerHistory.people[0].plannedHours, 6);
assert.equal(managerHistory.people[0].shortShifts, 1);
assert.equal((await call(employee, 'GET', '/api/history?start=2026-02-30')).status, 400);
db.prepare("INSERT INTO shifts(user_id,work_date,start,end,in_at,status) VALUES(?,?,?,?,?,'approved')").run(colleague, yesterday, 12, 18, new Date(Date.now() - 6 * 3600000).toISOString());
assert.equal((await action(colleague, 'clockOut', yesterday, { code: attendanceCode })).status, 200, 'started shift can close next day');
assert.equal((await action(colleague, 'clockIn', yesterday)).status, 409, 'clock-in remains limited to shift day');
assert.equal((await view(manager, yesterday)).activeCount, 0, 'past day is not on shift now');
db.prepare("INSERT INTO shifts(user_id,work_date,start,end,status) VALUES(?,?,?,?, 'pending') ON CONFLICT(user_id,work_date) DO UPDATE SET status='pending',in_at=NULL,out_at=NULL").run(colleague, yesterday, 10, 16);
assert.equal((await action(manager, 'approve', yesterday, { userId: colleague })).status, 409, 'past request cannot be approved');
assert.equal((await action(colleague, 'book', today, { start: 10, end: 16 })).status, 409, 'same-day past hours cannot be booked');
db.prepare("INSERT INTO shifts(user_id,work_date,start,end,status) VALUES(?,?,?,?, 'pending') ON CONFLICT(user_id,work_date) DO UPDATE SET start=excluded.start,end=excluded.end,status='pending'").run(colleague, today, 10, 16);
assert.equal((await action(manager, 'approve', today, { userId: colleague })).status, 409, 'stale pending shift cannot be approved');
const late = 'late@example.com';
await view(late);
assert.equal((await action(employee, 'setAvailability', yesterday, { status: 'available', start: 10, end: 18 })).status, 400);
assert.equal((await action(late, 'setAvailability', tomorrow, { status: 'available', start: 18, end: 10 })).status, 400);
assert.equal((await action(late, 'setAvailability', tomorrow, { status: 'unavailable' })).status, 200);
assert.equal((await view(late, tomorrow)).availability.status, 'unavailable');
assert.equal((await action(late, 'book', tomorrow, { start: 11, end: 17 })).status, 409);
assert.equal((await view(manager, tomorrow)).roster.find(x => x.userId === late).status, 'unavailable');
assert.equal((await view(employee, tomorrow)).roster, undefined, 'roster is manager-only');
assert.equal((await action(late, 'setAvailability', tomorrow, { status: 'available', start: 10, end: 18 })).status, 200);
assert.equal((await action(late, 'book', tomorrow, { start: 9, end: 16 })).status, 409);
assert.equal((await action(late, 'book', tomorrow, { start: 11, end: 17 })).status, 200);
assert.equal((await action(late, 'setAvailability', tomorrow, { status: 'unavailable' })).status, 409);
assert.equal((await action(late, 'setAvailability', tomorrow, { status: 'available', start: 12, end: 17 })).status, 409);
assert.ok((await (await call(manager, 'GET', '/api/attention')).json()).pending.some(x => x.userId === late));
assert.equal((await call(employee, 'GET', '/api/attention')).status, 403);
assert.equal((await action(manager, 'approve', tomorrow, { userId: late })).status, 200);
assert.equal((await action(late, 'clearAvailability', tomorrow)).status, 200);
assert.equal((await view(late, tomorrow)).availability, null);
db.prepare("INSERT INTO shifts(user_id,work_date,start,end,status) VALUES(?,?,?,?, 'approved')").run(late, yesterday, 10, 16);
assert.equal((await action(late, 'requestCorrection', tomorrow, { kind: 'in', time: '10:00', reason: 'Забыл отметку' })).status, 400);
assert.equal((await action(late, 'requestCorrection', yesterday, { kind: 'out', time: '16:00', reason: 'Забыл отметку' })).status, 409);
assert.equal((await action(late, 'requestCorrection', yesterday, { kind: 'in', time: '10:00', reason: 'Забыл отметку' })).status, 200);
assert.equal((await action(late, 'requestCorrection', yesterday, { kind: 'in', time: '10:00', reason: 'Дубль' })).status, 409);
let correctionRows = (await (await call(manager, 'GET', '/api/corrections')).json()).rows;
let correction = correctionRows.find(x => x.name === late && x.date === yesterday && x.kind === 'in');
assert.ok(correction);
assert.equal((await (await call(employee, 'GET', '/api/corrections')).json()).rows.length, 0, 'other employee cannot see corrections');
assert.equal((await action(employee, 'reviewCorrection', today, { correctionId: correction.id, decision: 'approve' })).status, 403);
assert.equal((await action(manager, 'reviewCorrection', today, { correctionId: correction.id, decision: 'approve' })).status, 200);
assert.equal((await action(manager, 'reviewCorrection', today, { correctionId: correction.id, decision: 'approve' })).status, 409);
assert.equal((await action(late, 'requestCorrection', yesterday, { kind: 'out', time: '13:00', reason: 'Ушёл по семейным делам' })).status, 200);
correctionRows = (await (await call(manager, 'GET', '/api/corrections')).json()).rows;
correction = correctionRows.find(x => x.name === late && x.date === yesterday && x.kind === 'out');
assert.equal((await action(manager, 'reviewCorrection', today, { correctionId: correction.id, decision: 'approve' })).status, 200);
assert.equal((await view(late, yesterday)).state.attendance.shortReason, 'Ушёл по семейным делам');
assert.equal((await (await call(late, 'GET', '/api/corrections')).json()).rows.length, 2);
assert.ok((await (await call(manager, 'GET', '/api/attention')).json()).short.some(x => x.userId === late));
assert.equal((await action(manager, 'reviewShortShift', yesterday, { userId: late, decision: 'disputed', note: ' ' })).status, 400);
assert.equal((await action(manager, 'reviewShortShift', yesterday, { userId: late, decision: 'disputed', note: 'Нужна проверка часов' })).status, 200);
assert.equal((await view(late, yesterday)).state.attendance.reviewStatus, 'disputed');
assert.ok((await (await call(employee, 'GET', '/api/notifications')).json()).rows.some(x => x.message.includes('согласована')));
assert.equal((await action(employee, 'markNotificationsRead')).status, 200);
assert.equal((await (await call(employee, 'GET', '/api/notifications')).json()).unread, 0);
assert.equal((await call(employee, 'GET', '/api/audit')).status, 403);
assert.ok((await (await call(manager, 'GET', '/api/audit')).json()).rows.some(x => x.action === 'short_shift_reviewed'));
const verifier = 'verifier@example.com';
await view(verifier);
db.prepare("INSERT INTO shifts(user_id,work_date,start,end,status) VALUES(?,?,?,?, 'approved')").run(verifier, today, 11, 18);
clockIso = '2026-10-22T09:05:00.000Z'; // 12:05 МСК: первоначальный код истёк
assert.equal((await action(verifier, 'clockIn', today, { code: attendanceCode })).status, 409);
const freshCode = (await (await action(manager, 'rotateAttendanceCode')).json()).code;
const wrongCode = freshCode === '999999' ? '999998' : '999999';
for (let i = 0; i < 5; i++) assert.equal((await action(verifier, 'clockIn', today, { code: wrongCode })).status, 409);
assert.equal((await action(verifier, 'clockIn', today, { code: freshCode })).status, 409, 'five errors trigger temporary block');
clockIso = '2026-10-22T09:21:00.000Z';
assert.equal((await action(verifier, 'clockIn', today, { code: freshCode })).status, 200);
async function renderClient(email, page = 'overview') {
  const root = { innerHTML: '', addEventListener(type, callback) { if (type === 'click') this.click = callback; } };
  const document = { getElementById: id => id === 'app' ? root : null, body: { classList: { toggle() {} } } };
  const localStorage = { getItem() { return null; }, setItem() {} };
  const fetch = (path, options = {}) => call(email, options.method || 'GET', path, options.body ? JSON.parse(options.body) : undefined);
  runInNewContext(clientScript, { document, localStorage, fetch, Date, Intl, URL, AbortController, setTimeout, clearTimeout, setInterval() {}, window: { addEventListener() {} }, console });
  await new Promise(resolve => setTimeout(resolve, 50));
  if (page !== 'overview') await root.click({ target: { closest: () => ({ dataset: { page } }) } });
  return root.innerHTML;
}
const managerUi = await renderClient(manager);
{
  const root = { innerHTML: '', addEventListener() {} };
  const document = { getElementById: id => id === 'app' ? root : null, body: { classList: { toggle() {} } } };
  runInNewContext(clientScript, { document, localStorage: { getItem() { return null; } }, fetch: async () => { throw new TypeError('network'); }, Date, Intl, URL, AbortController, setTimeout, clearTimeout, setInterval() {}, window: { addEventListener() {} }, console });
  await new Promise(resolve => setTimeout(resolve, 10));
  assert.match(root.innerHTML, /Не удалось открыть кабинет/);
  assert.match(root.innerHTML, /Повторить/);
}
const employeeUi = await renderClient(employee);
const managerRequestsUi = await renderClient(manager, 'requests');
const employeeRequestsUi = await renderClient(employee, 'requests');
const employeeProfileUi = await renderClient(employee, 'profile');
assert.match(managerUi, /Сотрудники и заявки/);
assert.match(managerUi, /Настроить потребность/);
assert.match(managerUi, /Требует внимания/);
assert.match(employeeUi, /Мои заявки/);
assert.match(managerRequestsUi, /Доступность команды/);
assert.match(managerRequestsUi, /Исправления отметок/);
assert.match(employeeRequestsUi, /Моя доступность/);
assert.match(employeeRequestsUi, /Пропущенная отметка/);
assert.match(employeeProfileUi, /Установить приложение/);
assert.doesNotMatch(employeeUi, /Сотрудники и заявки/);
assert.doesNotMatch(managerUi, /Алина Морозова|Даниил Волков/, 'prototype fixtures are absent');

 // New pilot: department need, manager-issued password accounts, approval and shared schedules.
 assert.equal((await action(employee,'setDepartmentNeed',tomorrow,{department:'alpha',hour:9,count:3})).status,403);
 assert.equal((await action(manager,'setDepartmentNeed',tomorrow,{department:'alpha',hour:9,count:3})).status,200);
 let matrix=await (await call(employee,'GET','/api/department-coverage?date='+tomorrow)).json();
 assert.deepEqual(matrix.slots.find(x=>x.department==='alpha'&&x.hour===9),{department:'alpha',hour:9,required:3,assigned:0,shortage:3});
 // A real exchange requires a claim and a manager decision before the roster changes.
 assert.equal((await action(late,'offerShift',tomorrow)).status,200);
 let offers=await (await call(colleague,'GET','/api/shift-market')).json();
 const listing=offers.offers.find(x=>x.ownerId===late&&x.date===tomorrow);
 assert.ok(listing&&listing.status==='open');
 assert.equal((await action(colleague,'volunteerShift',tomorrow,{offerId:listing.id})).status,200);
 assert.equal((await action(manager,'reviewShiftOffer',tomorrow,{offerId:listing.id,decision:'approve'})).status,200);
 assert.equal((await view(colleague,tomorrow)).state.my.status,'approved');
 assert.equal((await view(late,tomorrow)).state.my,null);
 assert.ok(!(await (await call(manager,'GET','/api/shift-market')).json()).offers.some(x=>x.id===listing.id));
 const newStaff=await call(manager,'POST','/api/admin/users',{name:'Тестовый сотрудник',username:'pilot.staff',password:'SecurePilot2026!',department:'alpha',universal:true});
 assert.equal(newStaff.status,200);
 const staffId=(await newStaff.json()).id;
 assert.equal((await call(employee,'GET','/api/admin/users')).status,403,'only manager can list accounts');
 const loginResponse=await app.fetch(new Request('https://example.test/api/auth/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({username:'pilot.staff',password:'SecurePilot2026!'})}),env);
 assert.equal(loginResponse.status,200,'staff can authenticate with real password');
 assert.equal((await loginResponse.clone().json()).mustChangePassword,false,'manager-issued password remains valid after first login');
 assert.match(loginResponse.headers.get('set-cookie'),/Max-Age=7776000/,'login stays active for 90 days');
 const cookie=loginResponse.headers.get('set-cookie').split(';')[0];
 async function sessionCall(method,path,body){
   return app.fetch(new Request('https://example.test'+path,{method,headers:{cookie,...(body?{'content-type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})}),env)
 }
 assert.equal((await sessionCall('GET','/api/state?date='+tomorrow)).status,200,'employee can use the app without a second password');
 assert.match(await (await app.fetch(new Request('https://example.test/',{headers:{cookie}}),env)).text(),/Управление сменами|Такт/);
 const changedPassword=await sessionCall('POST','/api/auth/change-password',{currentPassword:'SecurePilot2026!',newPassword:'FreshPilot2026!'});
 assert.equal(changedPassword.status,200);
 assert.equal((await (await sessionCall('GET','/api/state?date='+tomorrow)).json()).role,'employee');
 assert.equal((await sessionCall('POST','/api/action',{type:'book',date:tomorrow,start:9,end:15,department:'alpha'})).status,200);
 assert.equal((await action(manager,'approve',tomorrow,{userId:staffId})).status,200);
 matrix=await (await call(employee,'GET','/api/department-coverage?date='+tomorrow)).json();
 assert.equal(matrix.slots.find(x=>x.department==='alpha'&&x.hour===9).assigned,1);
 assert.equal((await sessionCall('GET','/api/admin/users')).status,403);
 assert.equal((await call(employee,'POST','/api/admin/roster',{people:[{name:'Тест Импорт',department:'mail',universal:false}]})).status,403);
 const rosterImport=await call(manager,'POST','/api/admin/roster',{people:[{name:'Тест Импорт',department:'mail',universal:false}]});
 assert.equal(rosterImport.status,200);
 assert.equal((await rosterImport.json()).added,1);
 assert.equal(db.prepare("SELECT COUNT(*) AS count FROM password_accounts WHERE user_id='prototype-001'").get().count,0,'roster import creates no login');
  const night=new Date(Date.parse(tomorrow)+86400000).toISOString().slice(0,10);
 assert.equal((await sessionCall('POST','/api/action',{type:'book',date:night,start:22,end:30,department:'night'})).status,200);
 assert.equal((await action(manager,'approve',night,{userId:staffId})).status,200);
 let overnight=await (await call(manager,'GET','/api/department-coverage?date='+new Date(Date.parse(night)+86400000).toISOString().slice(0,10))).json();
 assert.equal(overnight.slots.find(x=>x.department==='night'&&x.hour===2).assigned,1,'overnight hours count on the next calendar date');
const disabled=await call(manager,'POST','/api/admin/staff',{userId:staffId,department:'alpha',universal:true,enabled:false});
 assert.equal(disabled.status,200);
 assert.equal((await sessionCall('GET','/api/state?date='+tomorrow)).status,401,'disabled account loses session');

const untrusted=await app.fetch(new Request('https://example.test/api/admin/users',{headers:{'oai-authenticated-user-id':manager,'oai-authenticated-user-email':manager}}),{...env,TRUST_OAI_HEADERS:'false'});
 assert.equal(untrusted.status,401,'SSO identity headers are rejected unless an authenticated trusted proxy is configured');
 console.log('Workflow checks passed');

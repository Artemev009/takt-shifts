import { writeFileSync } from 'node:fs';

const accountId=(process.env.CLOUDFLARE_ACCOUNT_ID||'').trim();
const databaseId=(process.env.CLOUDFLARE_D1_DATABASE_ID||'').trim();
const databaseName=(process.env.CLOUDFLARE_D1_DATABASE_NAME||'takt-shifts-live').trim();
const workerName=(process.env.TAKT_WORKER_NAME||'takt-shifts-live').trim();

if(!/^[a-f\d]{32}$/i.test(accountId))throw Error('Missing or invalid CLOUDFLARE_ACCOUNT_ID (32 hex characters)');
if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(databaseId))throw Error('Missing or invalid CLOUDFLARE_D1_DATABASE_ID (UUID)');
if(!/^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$/.test(workerName))throw Error('Invalid TAKT_WORKER_NAME');
if(!/^[a-z0-9][a-z0-9-_]{1,62}$/.test(databaseName))throw Error('Invalid CLOUDFLARE_D1_DATABASE_NAME');

const config={
  name:workerName,
  main:'dist/server/index.js',
  compatibility_date:'2026-10-27',
  account_id:accountId,
  workers_dev:true,
  d1_databases:[{
    binding:'DB',
    database_name:databaseName,
    database_id:databaseId,
    migrations_dir:'drizzle',
  }],
  vars:{TRUST_OAI_HEADERS:'false'},
};
writeFileSync('wrangler.json',JSON.stringify(config,null,2)+'\n',{mode:0o600});
console.log('Generated explicit D1-bound standalone Worker config (SSO headers disabled).');

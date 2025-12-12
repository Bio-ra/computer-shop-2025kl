const { spawnSync } = require('child_process');

function log(...args) {
  console.log('[postinstall]', ...args);
}

// If DATABASE_URL is not set, skip prisma generate on CI/build environments.
if (!process.env.DATABASE_URL) {
  log('DATABASE_URL not found in environment — skipping prisma generate.');
  process.exit(0);
}

log('DATABASE_URL found — running `prisma generate`');
const res = spawnSync('npx', ['prisma', 'generate'], { stdio: 'inherit' });
if (res.error) {
  console.error('[postinstall] prisma generate failed:', res.error);
  process.exit(res.status || 1);
}
process.exit(res.status || 0);

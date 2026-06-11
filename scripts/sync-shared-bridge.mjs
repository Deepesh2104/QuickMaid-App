#!/usr/bin/env node
/**
 * Copy canonical bridge modules from QuickMaid-App/shared/ into each app's Metro bundle.
 * Run after editing shared/*.ts: npm run sync:shared
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const canonical = join(root, 'shared');
const targets = [
  join(root, 'apps/customer/shared'),
  join(root, 'apps/partner/shared'),
];

const files = readdirSync(canonical).filter((f) => f.endsWith('.ts'));

for (const target of targets) {
  mkdirSync(target, { recursive: true });
  for (const file of files) {
    const src = join(canonical, file);
    const dest = join(target, file);
    const banner = `/** Keep in sync with QuickMaid-App/shared/${file} — run: npm run sync:shared */\n`;
    const body = readFileSync(src, 'utf8');
    const stripped = body.replace(/^\/\*\*[\s\S]*?\*\/\s*\n/, '');
    writeFileSync(dest, banner + stripped, 'utf8');
    const rel = dest.replace(root + '/', '').replace(root + '\\', '');
    console.log(`synced ${file} → ${rel}`);
  }
}

console.log(`\n✓ ${files.length} files × ${targets.length} apps`);

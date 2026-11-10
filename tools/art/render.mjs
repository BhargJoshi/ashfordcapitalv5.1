// Renders every scene in scenes.mjs to src/assets/img/art/<name>.webp
//   node tools/art/render.mjs            (all scenes)
//   node tools/art/render.mjs missing    (only the named ones)
// Needs Playwright (any recent version) — the WebP files are already committed,
// so you only run this when you want to change or replace an illustration.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCENES } from './scenes.mjs';

const require = createRequire(process.env.PW_PATH || '/opt/npm-tools/');
const { chromium } = require('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '../../src/assets/img/art');
const preview = process.env.ART_PREVIEW; // optional folder for PNG previews
mkdirSync(outDir, { recursive: true });
if (preview) mkdirSync(preview, { recursive: true });

const only = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage();
for (const [name, def] of Object.entries(SCENES)) {
  if (only.length && !only.includes(name)) continue;
  const svg = def.build();
  const { webp, png } = await page.evaluate(async ({ svg, w, h, q, wantPng }) => {
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode();
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    cv.getContext('2d').drawImage(img, 0, 0, w, h);
    return { webp: cv.toDataURL('image/webp', q), png: wantPng ? cv.toDataURL('image/png') : null };
  }, { svg, w: def.out[0], h: def.out[1], q: def.q ?? 0.82, wantPng: !!preview });
  const buf = Buffer.from(webp.split(',')[1], 'base64');
  writeFileSync(join(outDir, `${name}.webp`), buf);
  if (preview && png) writeFileSync(join(preview, `${name}.png`), Buffer.from(png.split(',')[1], 'base64'));
  console.log(name, def.out.join('x'), Math.round(buf.length / 1024) + ' KB');
}
await browser.close();

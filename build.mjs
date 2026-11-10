// Ashford Capital — static site build.
// Zero-framework: composes src/pages with partials + generated components,
// bundles/minifies CSS + JS with esbuild, copies assets to ./site
import { readFileSync, writeFileSync, mkdirSync, readdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, 'src');
const OUT = join(ROOT, 'site');

// Preflight: if the repository was only partly uploaded, say exactly what is missing
// instead of failing with a bare "Cannot find module".
const REQUIRED = [
  'src/visuals.mjs', 'src/js/main.js', 'src/data/library.json',
  'src/css/00-base.css', 'src/partials/header.html', 'src/partials/footer.html', 'src/pages/index.html',
  'src/assets/fonts/montserrat-latin-wght-normal.woff2', 'src/assets/img/ashford-logo.png',
];
const missing = REQUIRED.filter((f) => !existsSync(join(ROOT, f)));
if (missing.length) {
  console.error('\nBuild stopped: these files are missing from the repository:\n  - ' + missing.join('\n  - ') +
    '\n\nThe whole folder must be uploaded, including everything inside src/ (the .mjs file is part of it).' +
    '\nIf you only want to publish the website, you can skip the build and deploy the ready-made site/ folder as it is.\n');
  process.exit(1);
}
let transformSync;
try { ({ transformSync } = await import('esbuild')); }
catch { console.error('\nBuild stopped: the "esbuild" package is not installed. Run `npm install` (or `npm ci`) first, and make sure your host installs dev dependencies before the build.\n'); process.exit(1); }
const { icon: vIcon, art: vArt, figureOf: vFigure, nodeSvg: vNode } = await import('./src/visuals.mjs');
const SITE_NAME = 'Ashford Capital';

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */
const read = (p) => readFileSync(join(SRC, p), 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ICONS = {
  arrow: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><circle cx="9" cy="9" r="5.5" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M13.2 13.2 17 17" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  check: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="m4.5 10.5 3.5 3.5 7.5-8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  play: '<svg class="i" viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M7 4.6v10.8a.6.6 0 0 0 .92.5l8.4-5.4a.6.6 0 0 0 0-1L7.92 4.1A.6.6 0 0 0 7 4.6Z" fill="currentColor"/></svg>',
};

/* ------------------------------------------------------------------ */
/* Generated component: "Welcome" scene (Join us, light side)          */
/* A small figure walks toward the Ashford emblem and stops beside it.  */
/* Pure SVG + CSS keyframes; the limb swing is generated so that the    */
/* figure walks only while it is moving and stands still on arrival.    */
/* ------------------------------------------------------------------ */
function welcome() {
  const CYCLE = 11;            // seconds for one walk
  const WALK0 = 4, WALK1 = 60; // % of the cycle spent walking
  const STRIDE = 8;            // % per stride (7 strides = 56%)
  const DIST = 178;            // px travelled (in the figure's own scale)
  const stops = (sign, amp, base, bob) => {
    const rot = (v) => `transform:rotate(${(base + v).toFixed(1)}deg)`;
    const val = (v) => (bob ? `transform:translateY(${v}px)` : rot(v));
    const out = [`0%{${val(0)}}`];
    for (let t = WALK0; t < WALK1; t += STRIDE) {
      const pts = bob ? [[0, -1.6], [2, 0], [4, -1.6], [6, 0]] : [[0, 0], [2, sign * amp], [4, 0], [6, -sign * amp]];
      for (const [dt, v] of pts) out.push(`${t + dt}%{${val(v)}}`);
    }
    out.push(`${WALK1}%{${val(0)}}`, `100%{${val(0)}}`);
    return out.join('');
  };
  const css = `
.wl-move{animation:wl-move ${CYCLE}s linear infinite}
.wl-bob{animation:wl-bob ${CYCLE}s linear infinite}
.wl-limb{transform-origin:0 0}
.wl-legA{animation:wl-legA ${CYCLE}s linear infinite}
.wl-legB{animation:wl-legB ${CYCLE}s linear infinite}
.wl-armA{animation:wl-armA ${CYCLE}s linear infinite}
.wl-armB{animation:wl-armB ${CYCLE}s linear infinite}
.wl-halo{animation:wl-halo ${CYCLE}s ease-in-out infinite}
.wl-logo{transform-box:fill-box;transform-origin:50% 100%;animation:wl-logo ${CYCLE}s ease-in-out infinite}
@keyframes wl-move{0%{transform:translateX(0);opacity:0}${WALK0}%{transform:translateX(0);opacity:1}${WALK1}%{transform:translateX(${DIST}px);opacity:1}88%{transform:translateX(${DIST}px);opacity:1}96%{transform:translateX(${DIST}px);opacity:0}100%{transform:translateX(0);opacity:0}}
@keyframes wl-bob{${stops(1, 0, 0, true)}}
@keyframes wl-legA{${stops(1, 26, 6)}}
@keyframes wl-legB{${stops(-1, 26, -6)}}
@keyframes wl-armA{${stops(-1, 20, 7)}}
@keyframes wl-armB{${stops(1, 20, -7)}}
@keyframes wl-halo{0%,${WALK1 - 2}%{opacity:.4;transform:scale(1)}${WALK1 + 6}%{opacity:1;transform:scale(1.08)}84%{opacity:.5;transform:scale(1)}100%{opacity:.4;transform:scale(1)}}
@keyframes wl-logo{0%,${WALK1}%{transform:scale(1)}${WALK1 + 5}%{transform:scale(1.045)}${WALK1 + 14}%,100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.wl-move,.wl-bob,.wl-legA,.wl-legB,.wl-armA,.wl-armB,.wl-halo,.wl-logo{animation:none}.wl-move{opacity:1;transform:translateX(${Math.round(DIST * 0.68)}px)}.wl-halo{opacity:.8}}`.replace(/\n/g, '');
  const limb = (cls, x, y, len, w, extra = '') => `<g transform="translate(${x} ${y})"><g class="wl-limb ${cls}"${extra}><path d="M0 0v${len}"/></g></g>`;
  return `<div class="welcome">
  <svg class="welcome__svg" viewBox="0 0 420 210" role="img" aria-label="A small figure walks toward the Ashford Capital emblem." focusable="false">
    <style>${css}</style>
    <defs>
      <radialGradient id="wl-glow"><stop offset="0" stop-color="#C9B796" stop-opacity=".75"/><stop offset="1" stop-color="#C9B796" stop-opacity="0"/></radialGradient>
      <linearGradient id="wl-ground" x1="0" x2="1"><stop offset="0" stop-color="#680C20" stop-opacity="0"/><stop offset=".2" stop-color="#680C20" stop-opacity=".6"/><stop offset=".85" stop-color="#680C20" stop-opacity=".6"/><stop offset="1" stop-color="#680C20" stop-opacity="0"/></linearGradient>
      <clipPath id="wl-clip"><rect x="296" y="86" width="100" height="100" rx="22"/></clipPath>
    </defs>
    <path d="M14 189H406" fill="none" stroke="url(#wl-ground)" stroke-width="2" stroke-dasharray="1 8" stroke-linecap="round"/>
    <circle class="wl-halo" cx="346" cy="136" r="92" fill="url(#wl-glow)" style="transform-box:fill-box;transform-origin:50% 50%"/>
    <g class="wl-logo">
      <image href="assets/img/ashford-logo.png" x="296" y="86" width="100" height="100" clip-path="url(#wl-clip)" preserveAspectRatio="xMidYMid slice"/>
      <rect x="296" y="86" width="100" height="100" rx="22" fill="none" stroke="#680C20" stroke-opacity=".35"/>
    </g>
    <g transform="translate(48 186) scale(1.15)">
      <g class="wl-move">
        <ellipse cx="2" cy="2" rx="15" ry="3" fill="#1D1517" fill-opacity=".14"/>
        <g class="wl-bob" fill="none" stroke="#680C20" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
          <g stroke-opacity=".5">${limb('wl-legB', 0, -33, 31)}${limb('wl-armB', 0, -55, 24)}</g>
          <rect x="-6.5" y="-62" width="13" height="32" rx="6.5" fill="#680C20" stroke="none"/>
          <circle cx="2" cy="-70.5" r="8" fill="#680C20" stroke="none"/>
          ${limb('wl-legA', 0, -33, 31)}${limb('wl-armA', 0, -55, 24)}
        </g>
      </g>
    </g>
  </svg>
  <p class="welcome__t">Welcome to <em>Ashford Capital.</em></p>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Generated component: the Ashford Method loop                        */
/* One proprietary framework, reused on Home + Method.                 */
/* ------------------------------------------------------------------ */
const LOOP = [
  { title: 'Market Intelligence', verb: 'Interpret', def: 'Read the market and keep only what matters now.' },
  { title: 'Decision Quality', verb: 'Decide', def: 'Form a thesis, test the conditions, define what proves it wrong.' },
  { title: 'Execution', verb: 'Execute', def: 'Act on the plan under uncertainty, with risk set first.' },
  { title: 'Review & Refinement', verb: 'Review', def: 'Judge the process apart from the outcome, then improve it.' },
];

function loopRing(id, { link = true } = {}) {
  const size = 400, c = 200, r = 142;
  const pt = (deg) => [c + r * Math.cos((deg * Math.PI) / 180), c + r * Math.sin((deg * Math.PI) / 180)];
  const gap = 17; // degrees reserved around each node
  const arcs = LOOP.map((_, k) => {
    const a0 = -90 + 90 * k + gap, a1 = -90 + 90 * (k + 1) - gap;
    const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
    const t = ((a1 + 90) * Math.PI) / 180;
    const ax = x1, ay = y1;
    const hx = (d) => ax + Math.cos(t + d) * -9, hy = (d) => ay + Math.sin(t + d) * -9;
    const head = `M${hx(0.45).toFixed(1)} ${hy(0.45).toFixed(1)} L${ax.toFixed(1)} ${ay.toFixed(1)} L${hx(-0.45).toFixed(1)} ${hy(-0.45).toFixed(1)}`;
    return `<g class="loop__arc" data-arc="${k}"><path class="loop__arc-line" d="M${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}"/><path class="loop__arc-head" d="${head}"/></g>`;
  }).join('');
  const nodes = LOOP.map((_, k) => {
    const [x, y] = pt(-90 + 90 * k);
    return `<button class="loop__node" type="button" tabindex="-1" aria-hidden="true" data-i="${k}" style="--x:${((x / size) * 100).toFixed(2)}%;--y:${((y / size) * 100).toFixed(2)}%"><span>${k + 1}</span></button>`;
  }).join('');
  const items = LOOP.map((it, k) => `
      <div class="acc__item${k === 0 ? ' is-open' : ''}" data-i="${k}">
        <h3 class="acc__head"><button class="acc__btn" type="button" id="${id}-t${k}" aria-expanded="${k === 0}" aria-controls="${id}-p${k}">
          <span class="acc__idx">0${k + 1}</span><span class="acc__title">${esc(it.title)}</span><span class="acc__tag">${esc(it.verb)}</span><span class="acc__icon" aria-hidden="true"></span></button></h3>
        <div class="acc__panel" id="${id}-p${k}" role="region" aria-labelledby="${id}-t${k}"><div class="acc__inner">
          <p class="loop__def">${esc(it.def)}</p>
        </div></div>
      </div>`).join('');
  return `<div class="loop" data-loop>
  <div class="loop__stage">
    <div class="loop__ring">
      <svg class="loop__svg" viewBox="0 0 ${size} ${size}" aria-hidden="true" focusable="false">
        <circle class="loop__guide" cx="${c}" cy="${c}" r="${r}"/>${arcs}
      </svg>
      ${nodes}
      <div class="loop__core" aria-hidden="true"><span class="loop__core-title" data-loop-title>${esc(LOOP[0].title)}</span><span class="loop__core-count" data-loop-count>01 / 04</span></div>
    </div>
  </div>
  <div class="loop__side">
    <div class="acc acc--loop" data-acc data-acc-single data-acc-hover>${items}
    </div>
    ${link ? `<a class="link-arrow loop__more" href="method.html#applied-example">See a worked example ${ICONS.arrow}</a>` : ''}
  </div>
</div>`;
}

/* ------------------------------------------------------------------ */
/* Social logo glyphs (hand-drawn, currentColor)                       */
/* ------------------------------------------------------------------ */
const SOCIAL_SVG = {
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3.5"/><path d="M8.2 10.6V16M8.2 7.9v.1M11.6 16v-5.4M11.6 12.7c0-1.4 1-2.2 2.2-2.2 1.3 0 2.1.8 2.1 2.3V16"/>',
  substack: '<path d="M5 5.5h14M5 9h14"/><path d="M5 12.5h14V20l-7-4-7 4z"/>',
};
const social = (n) => {
  if (!SOCIAL_SVG[n]) throw new Error(`Missing social glyph: ${n}`);
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${SOCIAL_SVG[n]}</svg>`;
};

/* ------------------------------------------------------------------ */
/* Client voices: the Home "Proof" bento (src/data/voices.json)         */
/* Up to four tiles, each a client photo with the words on top of it.   */
/* Entries marked "sample": true carry a visible "Sample" badge.        */
/* ------------------------------------------------------------------ */
function voices() {
  const p = join(SRC, 'data/voices.json');
  const items = (existsSync(p) ? JSON.parse(readFileSync(p, 'utf8')) : []).slice(0, 4);
  if (!items.length) {
    return `<div class="bento bento--n0"><article class="bt bt--empty reveal">${vIcon('bubble', 'bt__quote')}<p class="bt__t">Client voices appear here, with context.</p></article></div>`;
  }
  const slot = ['a', 'b', 'c', 'd'];
  const tiles = items.map((v, i) => {
    const img = v.image ? `<img class="vcard__img" src="${esc(v.image)}" alt="${esc(v.alt || '')}" loading="lazy" decoding="async" style="object-position:${esc(v.focus || '50% 30%')}">` : '';
    const badge = v.sample ? '<span class="vcard__badge">Sample</span>' : '';
    const who = `<p class="vcard__who">${v.name ? `<strong>${esc(v.name)}</strong>` : ''}${v.context ? `<span>${esc(v.context)}</span>` : ''}</p>`;
    return `<article class="bt bt--${slot[i]} vcard reveal"${i ? ` style="--rd:${i * 80}ms"` : ''}>${img}${badge}<div class="vcard__cap"><blockquote class="vcard__q"><p>&ldquo;${esc(v.quote)}&rdquo;</p></blockquote>${who}</div></article>`;
  });
  return `<div class="bento bento--n${items.length}">${tiles.join('')}</div>`;
}

/* ------------------------------------------------------------------ */
/* Generated component: Research Library (static HTML, JS filters it)  */
/* ------------------------------------------------------------------ */
const LIB_ICON = { Concept: 'context', Framework: 'systems', 'Decision Lab': 'lab', 'Trade Autopsy': 'review', Standard: 'accountability' };

function library() {
  const p = join(SRC, 'data/library.json');
  if (!existsSync(p)) return '';
  const items = JSON.parse(readFileSync(p, 'utf8'));
  return `<ol class="lib__list acc" data-acc data-lib-list>` + items.map((it, k) => {
    const search = esc([it.title, it.summary, it.type, it.topicLabel, it.categoryLabel, ...it.body.map((b) => b.text || (b.items || []).join(' '))].join(' ').toLowerCase());
    const body = it.body.map((b) => {
      if (b.items) return `<ul>${b.items.map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
      return `<p>${esc(b.text)}</p>`;
    }).join('');
    return `<li class="lib__item acc__item" data-category="${esc(it.category)}" data-search="${search}">
  <h3 class="acc__head"><button class="acc__btn lib__btn" type="button" id="lib-t${k}" aria-expanded="false" aria-controls="lib-p${k}">
    <span class="lib__ico">${vIcon(LIB_ICON[it.type] || 'context')}</span>
    <span class="lib__meta"><span class="lib__type">${esc(it.type)}</span><span class="lib__cat">${esc(it.categoryLabel)}</span></span>
    <span class="lib__title">${esc(it.title)}</span>
    <span class="lib__summary">${esc(it.summary)}</span>
    <span class="acc__icon" aria-hidden="true"></span></button></h3>
  <div class="acc__panel" id="lib-p${k}" role="region" aria-labelledby="lib-t${k}"><div class="acc__inner lib__body">${body}</div></div>
</li>`;
  }).join('') + `</ol>`;
}

/* ------------------------------------------------------------------ */
/* Page assembly                                                       */
/* ------------------------------------------------------------------ */
const partials = {};
for (const f of readdirSync(join(SRC, 'partials'))) partials[f.replace('.html', '')] = read(`partials/${f}`);

function parseMeta(src) {
  const m = src.match(/^<!--meta\n([\s\S]*?)-->\n?/);
  const meta = {};
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
  }
  return { meta, body: m ? src.slice(m[0].length) : src };
}

function render(tpl, meta) {
  let out = tpl;
  out = out.replace(/\{\{> ([\w-]+)\}\}/g, (_, n) => {
    if (!partials[n]) throw new Error(`Missing partial: ${n}`);
    return partials[n];
  });
  out = out.replace(/\{\{icon:(\w+)\}\}/g, (_, n) => {
    if (!ICONS[n]) throw new Error(`Missing icon: ${n}`);
    return ICONS[n];
  });
  out = out.replace(/\{\{ic:([\w-]+)(?::([\w-]+))?\}\}/g, (_, n, v) => vIcon(n, v ? `vi--${v}` : ''));
  out = out.replace(/\{\{art:([\w-]+)\}\}/g, (_, n) => vArt(n));
  out = out.replace(/\{\{fig:([\w-]+)\}\}/g, (_, n) => vFigure(n));
  out = out.replace(/\{\{node(?::([\w-]+))?\}\}/g, (_, c) => vNode(c || 'insight__node'));
  out = out.replace(/\{\{social:([\w-]+)\}\}/g, (_, n) => social(n));
  out = out.replace(/\{\{voices\}\}/g, () => voices());
  out = out.replace(/\{\{loop:([\w-]+)(?::(nolink))?\}\}/g, (_, id, nl) => loopRing(id, { link: !nl }));
  out = out.replace(/\{\{welcome\}\}/g, () => welcome());
  out = out.replace(/\{\{library\}\}/g, library());
  out = out.replace(/\{\{year\}\}/g, String(new Date().getFullYear()));
  // mark active nav link
  out = out.replace(/data-nav="([\w-]+)"/g, (m, k) => (k === meta.nav ? `${m} aria-current="page"` : m));
  return out;
}

const FONT_PRELOAD = ['montserrat-latin-wght-normal.woff2']
  .map((f) => `<link rel="preload" href="assets/fonts/${f}" as="font" type="font/woff2" crossorigin>`).join('\n');

function layout(meta, body) {
  const title = meta.home ? meta.title : `${meta.title} — ${SITE_NAME}`;
  const robots = meta.robots ? `<meta name="robots" content="${meta.robots}">` : '';
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(meta.description)}">
<meta name="theme-color" content="#680C20">
${robots}
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(meta.description)}">
<meta property="og:type" content="website">
<link rel="icon" href="favicon-32.png" sizes="32x32" type="image/png">
<link rel="icon" href="favicon-192.png" sizes="192x192" type="image/png">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
${FONT_PRELOAD}
<link rel="stylesheet" href="assets/css/main.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="${meta.body || ''}">
<a class="skip" href="#main">Skip to content</a>
${body}
<script src="assets/js/config.js" defer></script>
<script src="assets/js/main.js" defer></script>
</body>
</html>
`;
}

function build() {
  rmSync(OUT, { recursive: true, force: true });
  mkdirSync(join(OUT, 'assets/css'), { recursive: true });
  mkdirSync(join(OUT, 'assets/js'), { recursive: true });

  // pages
  const pages = readdirSync(join(SRC, 'pages')).filter((f) => f.endsWith('.html'));
  for (const f of pages) {
    const { meta, body } = parseMeta(read(`pages/${f}`));
    const shell = `{{> header}}\n<main id="main" tabindex="-1">\n${body}\n</main>\n{{> footer}}`;
    writeFileSync(join(OUT, f), layout(meta, render(shell, meta)));
  }

  // css (ordered concat → minify)
  const cssFiles = readdirSync(join(SRC, 'css')).filter((f) => f.endsWith('.css')).sort();
  const css = cssFiles.map((f) => read(`css/${f}`)).join('\n');
  writeFileSync(join(OUT, 'assets/css/main.css'), transformSync(css, { loader: 'css', minify: true }).code);

  // js
  const js = read('js/main.js');
  writeFileSync(join(OUT, 'assets/js/main.js'), transformSync(js, { minify: true, target: 'es2019' }).code);

  // assets
  cpSync(join(SRC, 'assets/fonts'), join(OUT, 'assets/fonts'), { recursive: true });
  if (existsSync(join(SRC, 'assets/img'))) cpSync(join(SRC, 'assets/img'), join(OUT, 'assets/img'), { recursive: true });
  // optional videos: anything placed in src/assets/video is deployed (README files are not)
  if (existsSync(join(SRC, 'assets/video'))) cpSync(join(SRC, 'assets/video'), join(OUT, 'assets/video'), { recursive: true, filter: (f) => !/(^|[\\/])(README\.md|\.gitkeep)$/i.test(f) });
  for (const f of ['favicon-32.png', 'favicon-192.png', 'apple-touch-icon.png']) cpSync(join(SRC, 'assets', f), join(OUT, f));
  if (existsSync(join(SRC, 'assets/config.js'))) cpSync(join(SRC, 'assets/config.js'), join(OUT, 'assets/js/config.js'));

  console.log(`Built ${pages.length} pages → site/`);
}

build();

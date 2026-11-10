// Ashford Capital — visual library.
// Line icons (48×48), page-hero illustrations and small figures, all drawn in one
// visual language: short "marks" that start scattered (knowledge) and align (execution),
// rings and nodes (decisions), and a single crimson line (the plan).
// Everything is inline SVG, generated deterministically at build time.

function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r1 = (n) => Math.round(n * 10) / 10;

/* ------------------------------------------------------------------ */
/* Icons                                                               */
/* ------------------------------------------------------------------ */
const A = (b) => `<g class="a">${b}</g>`;      // accent stroke
const F = (b) => `<g class="af">${b}</g>`;     // accent fill

const ICON_BODIES = {
  // problem / symptoms
  hesitate: `<path d="M5 24h12m-4-5 5 5-5 5"/><path d="M43 24H31m4-5-5 5 5 5"/>${A('<circle cx="24" cy="24" r="3"/>')}`,
  conflict: `${F('<circle cx="9" cy="24" r="2.6"/>')}<path d="M11.6 24 36 11"/><path d="M11.6 24 36 37"/>${A('<path d="M11.6 24H38"/>')}<circle cx="39" cy="10" r="2.2"/><circle cx="39" cy="38" r="2.2"/><circle cx="41" cy="24" r="2.2"/>`,
  inconsistent: `<path d="M5 32h38" stroke-dasharray="3 4" opacity=".55"/><path d="M5 32h14"/>${A('<path d="M19 32 24 18l6 20 5-12"/>')}<path d="M35 26h8"/>`,
  // market intelligence
  context: `${A('<path d="M24 8 42 17 24 26 6 17z"/>')}<path d="m6 24 18 9 18-9"/><path d="m6 31 18 9 18-9"/>`,
  variables: `<path d="M6 14h36M6 24h36M6 34h36"/><circle cx="17" cy="14" r="3.2" fill="var(--vi-bg,#fff)"/>${A('<circle cx="31" cy="24" r="3.2" fill="var(--vi-bg,#fff)"/>')}<circle cx="22" cy="34" r="3.2" fill="var(--vi-bg,#fff)"/>`,
  structure: `<path d="M5 38h9V28h10V18h10V9h9"/>${A('<path d="M5 18h38" stroke-dasharray="2 4"/>')}`,
  priority: `${A('<path d="M7 12h34" stroke-width="3.4"/>')}<path d="M7 24h24"/><path d="M7 36h12"/>`,
  // decision quality
  thesis: `<circle cx="24" cy="26" r="15"/><circle cx="24" cy="26" r="8"/>${A('<path d="M42 6 25.5 22.5M35 6h7v7"/>')}`,
  conditions: `<rect x="7" y="8" width="10" height="10" rx="2"/><rect x="7" y="29" width="10" height="10" rx="2"/>${A('<path d="m9.5 13 2.2 2.2 4-4.4"/>')}<path d="M24 13h17M24 34h17"/><path d="M24 24h12" opacity=".5"/>`,
  alternatives: `${F('<circle cx="8" cy="24" r="2.6"/>')}<path d="M10.6 24H20m0 0 15-12m-15 12h15m-15 0 15 12"/>${A('<circle cx="38" cy="11" r="2.4"/>')}<circle cx="38" cy="24" r="2.4"/><circle cx="38" cy="37" r="2.4"/>`,
  conviction: `<path d="M7 34a17 17 0 0 1 34 0"/>${A('<path d="m24 34 9-13"/>')}<circle cx="24" cy="34" r="2.6"/><path d="M12 38h24" opacity=".5"/>`,
  invalidation: `<path d="M5 30h38" stroke-dasharray="3 3"/><path d="M5 12 15 18l7-5 8 17" />${A('<circle cx="35" cy="30" r="6"/><path d="m32.4 27.4 5.2 5.2m0-5.2-5.2 5.2"/>')}`,
  // execution
  action: `<path d="M5 24h26m-9-9 9 9-9 9"/>${A('<circle cx="39" cy="24" r="4"/>')}`,
  risk: `<path d="M24 6 38 11v12c0 9-6 15-14 19C16 38 10 32 10 23V11z"/>${A('<path d="m17.5 24 5 5 8-9"/>')}`,
  process: `<path d="M38 24a14 14 0 1 1-4.6-10.4"/><path d="M36 7v8h-8"/>${A('<circle cx="24" cy="24" r="3"/>')}`,
  plan: `<rect x="9" y="6" width="30" height="36" rx="3"/>${A('<path d="M16 16h16M16 24h16M16 32h9"/>')}`,
  // review
  review: `<circle cx="21" cy="21" r="12"/><path d="m30 30 11 11"/>${A('<path d="m16 21 4 4 6-7"/>')}`,
  audit: `<rect x="11" y="9" width="26" height="33" rx="3"/><path d="M19 9V6h10v3"/>${A('<path d="m17 21 3 3 5-6M17 33l3 3 5-6"/>')}<path d="M29 21h4M29 33h4"/>`,
  outcome: `<path d="M8 24h32M24 8v32"/>${F('<circle cx="33" cy="15" r="3"/>')}<circle cx="15" cy="33" r="3"/><circle cx="33" cy="33" r="3" opacity=".5"/><circle cx="15" cy="15" r="3" opacity=".5"/>`,
  feedback: `<path d="M10 20a14 14 0 0 1 25-5"/><path d="M36 8v8h-8"/><path d="M38 28a14 14 0 0 1-25 5"/><path d="M12 40v-8h8"/>${A('<circle cx="24" cy="24" r="2.4"/>')}`,
  // why Ashford exists
  overload: `<path d="M8 12h24M13 19h28M8 26h20M15 33h26M10 40h16"/>${A('<path d="M13 19h28"/>')}`,
  hindsight: `<path d="M22 12 8 24l14 12z"/>${A('<path d="M40 12 26 24l14 12z"/>')}`,
  gap: `<path d="M5 34h13M30 34h13"/><path d="M18 34v6M30 34v6" opacity=".5"/>${A('<path d="M11 29C16 10 32 10 37 29M37 29l-1.2-8M37 29l-7.6-3.4"/>')}`,
  signal: `${F('<circle cx="12" cy="24" r="3.4"/>')}${A('<path d="M22 15a13 13 0 0 1 0 18M28 9a21 21 0 0 1 0 30"/>')}<path d="M34 5a29 29 0 0 1 0 38" opacity=".5"/>`,
  // philosophy
  clarity: `<circle cx="24" cy="24" r="15"/>${A('<path d="M9 24h30"/>')}<circle cx="24" cy="24" r="3.2" fill="var(--vi-bg,#fff)"/>`,
  systems: `<circle cx="24" cy="10" r="4"/><circle cx="9" cy="36" r="4"/>${A('<circle cx="39" cy="36" r="4"/>')}<path d="m22 13.6-11 19M26 13.6l11 19M13 36h22"/>`,
  independence: `<circle cx="24" cy="24" r="16"/>${A('<path d="m24 12 5 12-5 12-5-12z"/>')}<circle cx="24" cy="24" r="1.8"/>`,
  // standard
  evidence: `<path d="M8 40V28M18 40V20M28 40V25M38 40V12"/>${A('<path d="M6 40h36"/>')}<circle cx="38" cy="12" r="2.4"/>`,
  accountability: `<circle cx="24" cy="24" r="16"/>${A('<path d="m16 24.5 5.5 5.5L33 18"/>')}`,
  reflection: `<path d="M6 24h36" opacity=".5"/><path d="M13 24a11 11 0 0 1 22 0"/>${A('<path d="M17 24a7 7 0 0 0 14 0" stroke-dasharray="2.4 3"/>')}<path d="M10 31a14 14 0 0 0 28 0" opacity=".5"/>`,
  // pathways
  eye: `<path d="M3 24c6-10 12-14 21-14s15 4 21 14c-6 10-12 14-21 14S9 34 3 24z"/>${A('<circle cx="24" cy="24" r="6"/>')}<circle cx="24" cy="24" r="1.8" fill="currentColor" stroke="none"/>`,
  operator: `<circle cx="24" cy="24" r="16"/><path d="M24 4v8M24 36v8M4 24h8M36 24h8"/>${A('<circle cx="24" cy="24" r="4.5"/>')}`,
  rings: `<circle cx="24" cy="24" r="17"/><circle cx="24" cy="24" r="10"/>${A('<circle cx="24" cy="24" r="3.4"/>')}<circle cx="39" cy="17" r="2.2" fill="currentColor" stroke="none"/>`,
  // learning & support
  live: `${F('<circle cx="24" cy="24" r="3.6"/>')}${A('<path d="M16.5 16.5a10.6 10.6 0 0 0 0 15M31.5 16.5a10.6 10.6 0 0 1 0 15"/>')}<path d="M10.5 10.5a19 19 0 0 0 0 27M37.5 10.5a19 19 0 0 1 0 27" opacity=".55"/>`,
  practice: `<path d="m9 39 2.5-9.5L32 9l7 7-20.5 20.5z"/>${A('<path d="m28 13 7 7"/>')}`,
  material: `<path d="M24 12c-4-3-10-4-17-4v28c7 0 13 1 17 4 4-3 10-4 17-4V8c-7 0-13 1-17 4z"/>${A('<path d="M24 12v28"/>')}`,
  feedbackmsg: `<path d="M7 9h34v24H22l-8 7v-7H7z"/>${A('<path d="M15 17h18M15 24h11"/>')}`,
  pulse: `<path d="M3 26h9l4-12 7 24 5-18 3 6h14"/>${A('<circle cx="39" cy="26" r="1.6" fill="currentColor"/>')}`,
  chart: `<path d="M10 40V28M20 40V16M30 40V23M40 40V8"/>${A('<path d="M6 40h38"/>')}`,
  discuss: `<path d="M5 9h24v17H16l-6 5v-5H5z"/>${A('<path d="M19 32v5l6-4h18V19H32"/>')}`,
  globe: `<circle cx="24" cy="24" r="17"/>${A('<ellipse cx="24" cy="24" rx="7" ry="17"/>')}<path d="M7 24h34M10 14h28M10 34h28" opacity=".6"/>`,
  pie: `<circle cx="24" cy="24" r="17"/>${A('<path d="M24 24V7a17 17 0 0 1 16.2 11.8z"/>')}<path d="M24 24 12 36" opacity=".5"/>`,
  ledger: `<rect x="8" y="6" width="32" height="36" rx="3"/><path d="M8 17h32M8 28h32M20 6v36" opacity=".6"/>${A('<path d="M25 11.5h10M25 22.5h10M25 33.5h6"/>')}`,
  // topic / misc
  lab: `<path d="M19 6h10M21 6v14L9 39a3 3 0 0 0 2.6 4.5h24.8A3 3 0 0 0 39 39L27 20V6"/>${A('<path d="M14 32h20"/>')}`,
  clipboard: `<rect x="11" y="9" width="26" height="33" rx="3"/><path d="M19 9V6h10v3"/>${A('<path d="M17 21h14M17 28h14M17 35h8"/>')}`,
  signpost: `<path d="M22 6v36"/><path d="M22 11h16l4 5-4 5H22"/>${A('<path d="M22 26H10l-4 5 4 5h12"/>')}`,
  person: `<circle cx="24" cy="15" r="7"/>${A('<path d="M9 41c0-9 6-14 15-14s15 5 15 14"/>')}`,
  institution: `<path d="m5 18 19-10 19 10z"/><path d="M10 21v15M19 21v15M29 21v15M38 21v15" />${A('<path d="M5 41h38"/>')}`,
  clock: `<circle cx="24" cy="24" r="17"/>${A('<path d="M24 13v11l8 5"/>')}`,
  shield: `<path d="M24 6 38 11v12c0 9-6 15-14 19C16 38 10 32 10 23V11z"/>`,
  bubble: `<path d="M7 9h34v24H22l-8 7v-7H7z"/>`,
  check: `<circle cx="24" cy="24" r="16"/>${A('<path d="m16 24.5 5.5 5.5L33 18"/>')}`,
};

export function icon(name, cls = '') {
  const b = ICON_BODIES[name];
  if (!b) throw new Error(`Missing visual icon: ${name}`);
  return `<svg class="vi${cls ? ' ' + cls : ''}" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${b}</svg>`;
}
export const ICON_NAMES = Object.keys(ICON_BODIES);

/* ------------------------------------------------------------------ */
/* Illustration primitives                                             */
/* ------------------------------------------------------------------ */
function mark({ x, y, len = 22, a0, a1, d = 0, cls = '' }) {
  const x1 = r1(x - len / 2), x2 = r1(x + len / 2);
  return `<line class="m${cls ? ' ' + cls : ''}" x1="${x1}" y1="${r1(y)}" x2="${x2}" y2="${r1(y)}" style="--a0:${Math.round(a0)}deg;--a1:${Math.round(a1)}deg;--d:${Math.round(d)}ms;--ox:${r1(x)}px;--oy:${r1(y)}px"/>`;
}
const toward = (x, y, tx, ty) => (Math.atan2(ty - y, tx - x) * 180) / Math.PI;

function svg(W, H, label, body) {
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label}" focusable="false">${body}</svg>`;
}
const lbl = (W, H, text, x, y, cls = '') =>
  `<span class="art__lbl${cls ? ' ' + cls : ''}" style="left:${r1((x / W) * 100)}%;top:${r1((y / H) * 100)}%">${text}</span>`;
const wrap = (name, W, H, inner, labels, extra = '') =>
  `<div class="art art--${name} reveal${extra}" style="aspect-ratio:${W}/${H}">${inner}${labels}</div>`;

/* ------------------------------------------------------------------ */
/* Page-hero illustrations                                             */
/* ------------------------------------------------------------------ */
function artMethod() {
  const W = 560, H = 440, rnd = mulberry32(23);
  let m = '';
  for (let k = 0; k < 28; k++) {
    const x = 26 + rnd() * 150, y = 104 + rnd() * 220;
    m += mark({ x, y, len: 22 + rnd() * 8, a0: rnd() * 180 - 90, a1: 0, d: 100 + rnd() * 700, cls: rnd() > 0.9 ? 'b' : '' });
  }
  for (let k = 0; k < 5; k++) m += mark({ x: 332 + k * 30, y: 214, len: 20, a0: rnd() * 180 - 90, a1: 0, d: 900 + k * 90, cls: 'c' });
  const body = `
    <path class="ln soft draw" pathLength="1" d="M208 96 300 205"/>
    <path class="ln soft draw" pathLength="1" d="M208 332 300 224"/>
    <path class="ln draw" pathLength="1" style="--d:500ms" d="M300 214H462"/>
    <g class="node"><circle class="ring faint" cx="492" cy="214" r="30"/><circle class="ring" cx="492" cy="214" r="15"/><circle class="dot" cx="492" cy="214" r="4.6"/></g>
    <path class="ln soft dash fade" d="M492 252C492 392 96 396 92 344"/>
    <path class="ln soft fade" d="m82 356 10-14 12 12"/>
    ${m}`;
  const labels = lbl(W, H, 'Interpret', 100, 70) + lbl(W, H, 'Decide', 270, 70) + lbl(W, H, 'Execute', 400, 178, 'on') + lbl(W, H, 'Review', 290, 414);
  return wrap('method', W, H, svg(W, H, 'Many inputs narrowing through a gate into one clear line that ends at a decision, with a return path for review.', body), labels);
}

function artPathways() {
  const W = 560, H = 440, rnd = mulberry32(31);
  const rings = [{ x: 108, y: 330, r: 46 }, { x: 276, y: 238, r: 64 }, { x: 448, y: 136, r: 86 }];
  let m = '';
  // ring 1: reading — scattered marks settling into rows
  for (let k = 0; k < 8; k++) { const x = rings[0].x - 24 + (k % 3) * 24, y = rings[0].y - 18 + Math.floor(k / 3) * 18; m += mark({ x, y, len: 16, a0: rnd() * 180 - 90, a1: 0, d: k * 80 }); }
  // ring 2: acting — marks converge on a decision point
  for (let k = 0; k < 8; k++) { const ang = (k / 8) * Math.PI * 2, x = rings[1].x + Math.cos(ang) * 40, y = rings[1].y + Math.sin(ang) * 40; m += mark({ x, y, len: 14, a0: rnd() * 180 - 90, a1: toward(x, y, rings[1].x, rings[1].y), d: 300 + k * 70, cls: 'c' }); }
  const body = `
    <path class="ln soft dash fade" d="M146 304 240 262"/>
    <path class="ln soft dash fade" d="M314 214 392 170"/>
    <circle class="ring soft" cx="${rings[0].x}" cy="${rings[0].y}" r="${rings[0].r}" fill="#fff"/>
    <circle class="ring mid" cx="${rings[1].x}" cy="${rings[1].y}" r="${rings[1].r}" fill="#fff"/>
    <circle class="ring" cx="${rings[2].x}" cy="${rings[2].y}" r="${rings[2].r}" fill="#fff"/>
    <circle class="ring faint" cx="${rings[2].x}" cy="${rings[2].y}" r="56"/>
    <circle class="ring faint" cx="${rings[2].x}" cy="${rings[2].y}" r="28"/>
    <circle class="dot" cx="${rings[2].x}" cy="${rings[2].y}" r="6"/>
    <circle class="dot" cx="${rings[1].x}" cy="${rings[1].y}" r="4.4"/>
    <circle class="dot" cx="${rings[2].x + 56}" cy="${rings[2].y}" r="4" />
    <circle class="dot" cx="${rings[2].x - 28 * 0.7}" cy="${rings[2].y - 28 * 0.7}" r="3.4" />
    ${m}`;
  const labels = lbl(W, H, '01 · See', 108, 396) + lbl(W, H, '02 · Act', 276, 318) + lbl(W, H, '03 · Allocate', 448, 244, 'on');
  return wrap('pathways', W, H, svg(W, H, 'Three rings of increasing scale, from reading the market, to acting on it, to allocating capital.', body), labels);
}

function artIntelligence() {
  const W = 560, H = 440, rnd = mulberry32(41);
  const lens = { x: 330, y: 214, r: 96 };
  const lines = [];
  for (let i = 0; i < 9; i++) {
    const y0 = 84 + i * 38, amp = 7 + rnd() * 9, ph = rnd() * 6;
    let d = `M16 ${r1(y0 + Math.sin(ph) * amp)}`;
    for (let x = 56; x <= 544; x += 40) d += ` L${x} ${r1(y0 + Math.sin(ph + x / 62) * amp)}`;
    lines.push({ d, y0 });
  }
  const faint = lines.map((l) => `<path class="ln faint" d="${l.d}"/>`).join('');
  const strong = lines.map((l, i) => `<path class="ln${i === 4 ? ' bold' : ''}" d="${l.d}"/>`).join('');
  let m = '';
  for (let k = 0; k < 14; k++) { const x = 20 + rnd() * 200, y = 60 + rnd() * 330; m += mark({ x, y, len: 14, a0: rnd() * 180 - 90, a1: 0, d: rnd() * 600 }); }
  const body = `
    <defs><clipPath id="lens-clip"><circle cx="${lens.x}" cy="${lens.y}" r="${lens.r}"/></clipPath></defs>
    <g class="fade">${faint}</g>
    <g clip-path="url(#lens-clip)" class="fade" style="--d:500ms">${strong}</g>
    <circle class="ring" cx="${lens.x}" cy="${lens.y}" r="${lens.r}"/>
    <circle class="ring faint" cx="${lens.x}" cy="${lens.y}" r="${lens.r + 14}"/>
    <path class="ln handle" d="M${r1(lens.x + lens.r * 0.72)} ${r1(lens.y + lens.r * 0.72)}l${r1(60)} ${r1(60)}"/>
    ${m}`;
  const labels = lbl(W, H, 'Noise', 120, 410) + lbl(W, H, 'What matters', lens.x - 20, lens.y + lens.r + 36, 'on');
  return wrap('intelligence', W, H, svg(W, H, 'Layers of market information with one lens bringing the relevant layer into focus.', body), labels);
}

function artBegin() {
  const W = 560, H = 440, rnd = mulberry32(53);
  const pts = [[60, 346], [170, 304], [280, 240], [392, 188], [500, 118]];
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length; i++) {
    const [px, py] = pts[i - 1], [x, y] = pts[i], mx = (px + x) / 2;
    d += ` C${mx} ${py} ${mx} ${y} ${x} ${y}`;
  }
  let m = '';
  for (let k = 0; k < 16; k++) { const x = 40 + rnd() * 120, y = 60 + rnd() * 120; m += mark({ x, y, len: 16, a0: rnd() * 180 - 90, a1: -20 - rnd() * 18, d: rnd() * 700 }); }
  const dots = pts.slice(0, 4).map(([x, y], i) => `<circle class="wp" cx="${x}" cy="${y}" r="12"/><circle class="dot fade" style="--d:${i * 250}ms" cx="${x}" cy="${y}" r="4"/>`).join('');
  const body = `
    <path class="ln soft dash fade" d="${d}"/>
    <path class="ln draw" pathLength="1" style="--d:200ms" d="${d}"/>
    ${dots}
    <g class="node"><circle class="ring faint" cx="500" cy="118" r="32"/><circle class="ring" cx="500" cy="118" r="16"/><circle class="dot" cx="500" cy="118" r="4.8"/></g>
    ${m}`;
  const labels = lbl(W, H, 'Experience', 60, 384) + lbl(W, H, 'Difficulty', 170, 342) + lbl(W, H, 'Process', 280, 278) + lbl(W, H, 'Objective', 392, 226) + lbl(W, H, 'Next step', 500, 170, 'on');
  return wrap('begin', W, H, svg(W, H, 'A short path of four questions leading to one relevant next step.', body), labels);
}

function artContact() {
  const W = 480, H = 260, rnd = mulberry32(61);
  let m = '';
  for (let k = 0; k < 7; k++) m += mark({ x: 170 + k * 20, y: 130, len: 14, a0: rnd() * 180 - 90, a1: 0, d: 200 + k * 80, cls: 'c' });
  for (let k = 0; k < 6; k++) m += mark({ x: 136 + k * 6, y: 130 - 16 + (k % 2) * 32, len: 12, a0: rnd() * 180 - 90, a1: 0, d: 100 + k * 90 });
  const body = `
    <circle class="ring soft" cx="72" cy="130" r="36"/><circle class="dot soft" cx="72" cy="130" r="6"/>
    <g class="node"><circle class="ring faint" cx="408" cy="130" r="36"/><circle class="ring" cx="408" cy="130" r="18"/><circle class="dot" cx="408" cy="130" r="5"/></g>
    <path class="ln soft draw" pathLength="1" d="M112 130H368"/>${m}`;
  const labels = lbl(W, H, 'You', 72, 190) + lbl(W, H, 'Ashford', 408, 190, 'on');
  return wrap('contact', W, H, svg(W, H, 'Two points joined by a single line.', body), labels);
}

export function art(name) {
  const f = { method: artMethod, pathways: artPathways, intelligence: artIntelligence, begin: artBegin, contact: artContact }[name];
  if (!f) throw new Error(`Missing art: ${name}`);
  return f();
}

/* ------------------------------------------------------------------ */
/* Small figures (cards)                                               */
/* ------------------------------------------------------------------ */
function figure(name, W, H, label, body, labels = '') {
  return `<div class="figbox"><div class="fig fig--${name} reveal" style="aspect-ratio:${W}/${H}">${svg(W, H, label, body)}${labels}</div></div>`;
}

function figReaders() {
  const W = 320, H = 190, rnd = mulberry32(71);
  let m = '';
  for (let k = 0; k < 16; k++) { const x = 20 + rnd() * 110, y = 24 + rnd() * 140; m += mark({ x, y, len: 16, a0: rnd() * 180 - 90, a1: 0, d: rnd() * 500 }); }
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) m += mark({ x: 196 + c * 30, y: 42 + r * 32, len: 18, a0: rnd() * 180 - 90, a1: 0, d: 200 + (r * 4 + c) * 40, cls: r === 1 ? 'c' : '' });
  const body = `<path class="ln soft dash" d="M140 96h34"/><path class="ln soft" d="m168 90 8 6-8 6"/>${m}`;
  return figure('readers', W, H, 'Scattered marks settling into ordered rows.', body);
}
function figOperators() {
  const W = 320, H = 190, rnd = mulberry32(73);
  let m = '';
  for (let k = 0; k < 7; k++) { const x = 18 + rnd() * 56, y = 52 + rnd() * 86; m += mark({ x, y, len: 14, a0: rnd() * 180 - 90, a1: 0, d: rnd() * 400 }); }
  const gates = [112, 170, 228].map((x) => `<path class="ln soft" d="M${x} 62v64"/><path class="ln soft" d="M${x + 8} 62v64"/>`).join('');
  const body = `${gates}<path class="ln soft dash" d="M18 156H302"/><path class="ln draw" pathLength="1" d="M82 94H262"/><g class="node"><circle class="ring faint" cx="284" cy="94" r="20"/><circle class="ring" cx="284" cy="94" r="10"/><circle class="dot" cx="284" cy="94" r="3.6"/></g>${m}`;
  return figure('operators', W, H, 'Marks aligning into one line that passes through three checkpoints to a decision.', body, `<span class="fig__lbl" style="left:5.6%;top:88%">Risk defined first</span>`);
}
function figThinkers() {
  const W = 320, H = 190, c = [160, 95];
  const body = `
    <circle class="ring faint" cx="${c[0]}" cy="${c[1]}" r="84"/>
    <circle class="ring soft" cx="${c[0]}" cy="${c[1]}" r="56"/>
    <circle class="ring" cx="${c[0]}" cy="${c[1]}" r="30"/>
    <circle class="ring crim-arc" cx="${c[0]}" cy="${c[1]}" r="56" pathLength="100" style="stroke-dasharray:34 66;transform-origin:${c[0]}px ${c[1]}px;transform:rotate(-70deg)"/>
    <circle class="dot" cx="${c[0]}" cy="${c[1]}" r="5"/>
    <circle class="dot" cx="${c[0] + 56 * Math.cos(-0.7)}" cy="${c[1] + 56 * Math.sin(-0.7)}" r="4"/>
    <circle class="dot soft" cx="${c[0] - 84}" cy="${c[1]}" r="3.6"/>
    <circle class="dot soft" cx="${c[0] + 30 * Math.cos(2.2)}" cy="${c[1] + 30 * Math.sin(2.2)}" r="3.4"/>
    <circle class="dot soft" cx="${c[0] + 84 * Math.cos(0.9)}" cy="${c[1] + 84 * Math.sin(0.9)}" r="3.6"/>`;
  return figure('thinkers', W, H, 'Concentric rings of capital with one weighted allocation.', body);
}

function figHesitation() {
  const W = 240, H = 140, rnd = mulberry32(81);
  const body = `
    <path class="ln draw" pathLength="1" d="M12 70H92"/>
    <circle class="ring loop-ring" cx="110" cy="70" r="18"/>
    <path class="ln soft dash fade" d="M128 70H170"/>
    <g class="node"><circle class="ring faint" cx="198" cy="70" r="24"/><circle class="ring" cx="198" cy="70" r="12"/><circle class="dot" cx="198" cy="70" r="3.4"/></g>
    ${mark({ x: 110, y: 34, len: 12, a0: 20, a1: -20 })}${mark({ x: 110, y: 106, len: 12, a0: -40, a1: 20 })}`;
  return figure('hesitation', W, H, 'A line approaches a decision point, stalls and wavers.', body);
}
function figConflict() {
  const W = 240, H = 140;
  const ends = [[196, 26], [214, 70], [196, 114]];
  const body = `
    <circle class="dot" cx="28" cy="70" r="5"/>
    ${ends.map(([x, y], i) => `<path class="ln ${i === 1 ? '' : 'soft'}" d="M33 70 ${x - 10} ${y}"/><circle class="ring ${i === 1 ? '' : 'soft'}" cx="${x}" cy="${y}" r="9"/>`).join('')}
    ${mark({ x: 120, y: 30, len: 12, a0: 0, a1: -20 })}${mark({ x: 120, y: 110, len: 12, a0: 0, a1: 20 })}`;
  return figure('conflict', W, H, 'One market, several valid readings pointing in different directions.', body);
}
function figInconsistent() {
  const W = 240, H = 140;
  const body = `
    <path class="ln soft dash" d="M12 70H230"/>
    <path class="ln draw" pathLength="1" d="M12 70H90L118 38 148 100 178 52 228 92"/>
    <circle class="dot" cx="90" cy="70" r="4.4"/>
    <circle class="ring" cx="118" cy="38" r="5.5"/><circle class="ring" cx="148" cy="100" r="5.5"/>`;
  return figure('inconsistent', W, H, 'A plan drawn as a straight line, and live execution that leaves it.', body);
}

function figClarity() {
  const W = 320, H = 130, rnd = mulberry32(91);
  let m = '';
  for (let k = 0; k < 16; k++) { const x = 16 + rnd() * 120, y = 16 + rnd() * 98; m += mark({ x, y, len: 16, a0: rnd() * 180 - 90, a1: 0, d: rnd() * 500 }); }
  for (let k = 0; k < 4; k++) m += mark({ x: 176 + k * 26, y: 65, len: 16, a0: rnd() * 180 - 90, a1: 0, d: 500 + k * 80, cls: 'c' });
  const body = `<path class="ln soft dash" d="M146 65h18"/><path class="ln draw" pathLength="1" d="M168 65H262"/><g class="node"><circle class="ring faint" cx="288" cy="65" r="24"/><circle class="ring" cx="288" cy="65" r="12"/><circle class="dot" cx="288" cy="65" r="3.8"/></g>${m}`;
  return figure('clarity', W, H, 'Scattered marks resolving into one clear line and a decision.', body);
}

/* a screenshot we deliberately do not show, beside a plan that holds */
function figNosnap() {
  const W = 320, H = 190, rnd = mulberry32(95);
  let m = '';
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) m += mark({ x: 190 + c * 28, y: 62 + r * 33, len: 18, a0: rnd() * 180 - 90, a1: 0, d: 200 + (r * 3 + c) * 50, cls: r === 1 ? 'c' : '' });
  const body = `
    <rect class="ln soft dash" x="26" y="34" width="104" height="124" rx="10"/>
    <path class="ln soft" d="M42 142 114 50"/>
    <path class="ln soft dash" d="M144 95h22"/>
    <g class="node"><circle class="ring faint" cx="288" cy="95" r="22"/><circle class="ring" cx="288" cy="95" r="11"/><circle class="dot" cx="288" cy="95" r="3.6"/></g>
    ${m}`;
  return figure('nosnap', W, H, 'A crossed-out screenshot beside marks aligning into a clear line and a decision.', body);
}

export function figureOf(name) {
  const f = { nosnap: figNosnap, clarity: figClarity, readers: figReaders, operators: figOperators, thinkers: figThinkers, hesitation: figHesitation, conflict: figConflict, inconsistent: figInconsistent }[name];
  if (!f) throw new Error(`Missing figure: ${name}`);
  return f();
}

/* ------------------------------------------------------------------ */
/* Drawn node: the recurring "one decision" mark                        */
/* ------------------------------------------------------------------ */
export function nodeSvg(cls = 'insight__node') {
  return `<svg class="${cls}" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><circle class="ring faint" cx="24" cy="24" r="21"/><circle class="ring" cx="24" cy="24" r="11"/><circle class="dot" cx="24" cy="24" r="3.6"/></svg>`;
}

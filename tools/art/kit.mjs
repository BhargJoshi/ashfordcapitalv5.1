// Ashford illustration kit — a tiny SVG scene builder with a hand-painted finish.
// Everything is drawn in code (no stock art, no text), then rasterised by render.mjs.
export const C = {
  crimson: '#680C20', deep: '#4A0817', soft: '#7E2236', rose: '#A9475B',
  beige: '#E6D9C4', paper: '#F6F0E5', sand: '#D9C9AB', tan: '#C9B796',
  ink: '#1D1517', charcoal: '#2E2A33', navy: '#233246', slate: '#3C5668',
  wallA: '#F1E8D8', wallB: '#E2D4BA', floorA: '#CDB591', floorB: '#B79C74',
  wood: '#8A5A3E', woodHi: '#A87250', woodDk: '#5E3A28',
  screen: '#122430', screen2: '#1B3544',
  up: '#3FA382', down: '#D1495B', amber: '#E3A93B', ice: '#9CC4D4',
  white: '#FFFFFF', shirt: '#F5F0E8', blue: '#6C8499',
  skinA: '#E3B08A', skinB: '#C98B62', skinC: '#9A6240',
  hairA: '#1E1517', hairB: '#4B2F22', hairC: '#9C6B43',
};

export class Scene {
  constructor(w, h, seed = 1) { this.w = w; this.h = h; this.defs = []; this.body = []; this.n = 0; this.seed = seed; this.s = seed; }
  id(p) { return `${p}${this.n++}`; }
  rnd() { this.s = (this.s * 16807) % 2147483647; return (this.s - 1) / 2147483646; }
  lin(stops, a = [0, 0, 0, 1]) {
    const i = this.id('lg');
    this.defs.push(`<linearGradient id="${i}" x1="${a[0]}" y1="${a[1]}" x2="${a[2]}" y2="${a[3]}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join('')}</linearGradient>`);
    return `url(#${i})`;
  }
  rad(stops, cx = .5, cy = .5, r = .5) {
    const i = this.id('rg');
    this.defs.push(`<radialGradient id="${i}" cx="${cx}" cy="${cy}" r="${r}">${stops.map(([o, c, op = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${op}"/>`).join('')}</radialGradient>`);
    return `url(#${i})`;
  }
  blur(sd) { const i = this.id('bl'); this.defs.push(`<filter id="${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${sd}"/></filter>`); return `url(#${i})`; }
  clip(shape) { const i = this.id('cp'); this.defs.push(`<clipPath id="${i}">${shape}</clipPath>`); return `url(#${i})`; }
  add(s) { this.body.push(s); return this; }
  // finish: displacement for wobbly painted edges + brush streaks + grain + warm vignette
  out({ wobble = 4, grain = .5, streak = .22, vignette = .16 } = {}) {
    const { w, h } = this;
    const filters = `
<filter id="paint" x="-2%" y="-2%" width="104%" height="104%">
  <feTurbulence type="fractalNoise" baseFrequency=".014" numOctaves="2" seed="${this.seed + 2}" result="n"/>
  <feDisplacementMap in="SourceGraphic" in2="n" scale="${wobble * 2.2}" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="${this.seed + 9}" result="n2"/>
  <feDisplacementMap in="d" in2="n2" scale="${wobble * .9}" xChannelSelector="G" yChannelSelector="R"/>
</filter>
<filter id="grain" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="${this.seed + 4}"/>
  <feColorMatrix values="0 0 0 0 .20  0 0 0 0 .10  0 0 0 0 .10  0 0 0 1.25 -.52"/>
</filter>
<filter id="streak" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".004 .10" numOctaves="3" seed="${this.seed + 6}"/>
  <feColorMatrix values="0 0 0 0 .35  0 0 0 0 .22  0 0 0 0 .20  0 0 0 1.6 -.72"/>
</filter>
<filter id="lightstreak" x="0" y="0" width="100%" height="100%">
  <feTurbulence type="fractalNoise" baseFrequency=".006 .07" numOctaves="3" seed="${this.seed + 12}"/>
  <feColorMatrix values="0 0 0 0 1  0 0 0 0 .97  0 0 0 0 .9  0 0 0 1.5 -.78"/>
</filter>`;
    const vg = this.rad([[0.55, '#000', 0], [1, '#2a0a12', vignette]], .5, .5, .75);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
<defs>${filters}${this.defs.join('')}</defs>
<g filter="url(#paint)">${this.body.join('\n')}</g>
<rect width="${w}" height="${h}" filter="url(#streak)" opacity="${streak}" style="mix-blend-mode:multiply"/>
<rect width="${w}" height="${h}" filter="url(#lightstreak)" opacity="${streak * .8}"/>
<rect width="${w}" height="${h}" filter="url(#grain)" opacity="${grain}" style="mix-blend-mode:multiply"/>
<rect width="${w}" height="${h}" fill="${vg}"/>
</svg>`;
  }
}

const f = (n) => Math.round(n * 10) / 10;
export const rr = (x, y, w, h, r, fill, extra = '') => `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="${r}" fill="${fill}" ${extra}/>`;
export const circ = (x, y, r, fill, extra = '') => `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="${fill}" ${extra}/>`;
export const ell = (x, y, rx, ry, fill, extra = '') => `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}" ${extra}/>`;
export const path = (d, fill = 'none', extra = '') => `<path d="${d}" fill="${fill}" ${extra}/>`;
export const line = (x1, y1, x2, y2, stroke, w = 3, extra = '') => `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" ${extra}/>`;
export const poly = (pts, fill, extra = '') => `<polygon points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="${fill}" ${extra}/>`;
export const g = (inner, tf = '', extra = '') => `<g ${tf ? `transform="${tf}"` : ''} ${extra}>${Array.isArray(inner) ? inner.join('') : inner}</g>`;
export const shadow = (sc, x, y, rx, ry, op = .25) => ell(x, y, rx, ry, '#2a1218', `opacity="${op}" filter="${sc.blur(Math.max(4, ry * .5))}"`);

/* ---------- shared pieces ---------- */
// two-bone inverse kinematics: elbow position for shoulder -> hand
export function ik(s, h, l1, l2, dir = 1) {
  let dx = h[0] - s[0], dy = h[1] - s[1], d = Math.hypot(dx, dy);
  const maxd = l1 + l2 - 2; if (d > maxd) { h = [s[0] + dx * maxd / d, s[1] + dy * maxd / d]; dx = h[0] - s[0]; dy = h[1] - s[1]; d = maxd; }
  const a = (l1 * l1 - l2 * l2 + d * d) / (2 * d), hh = Math.sqrt(Math.max(l1 * l1 - a * a, 0));
  const ux = dx / d, uy = dy / d;
  return { elbow: [s[0] + ux * a - dir * uy * hh, s[1] + uy * a + dir * ux * hh], hand: h };
}

// candlesticks on a dark screen. series: array of [open, high, low, close] in 0..1 (1 = top)
export function candles(x, y, w, h, series, { up = C.up, down = C.down, wick = 2.4, gap = .28 } = {}) {
  const n = series.length, cw = w / n, bw = cw * (1 - gap);
  return series.map(([o, hi, lo, cl], i) => {
    const cx = x + cw * i + cw / 2, col = cl >= o ? up : down;
    const yo = y + h * (1 - o), yc = y + h * (1 - cl), yh = y + h * (1 - hi), yl = y + h * (1 - lo);
    return `<line x1="${f(cx)}" y1="${f(yh)}" x2="${f(cx)}" y2="${f(yl)}" stroke="${col}" stroke-width="${wick}"/><rect x="${f(cx - bw / 2)}" y="${f(Math.min(yo, yc))}" width="${f(bw)}" height="${f(Math.max(Math.abs(yo - yc), 2))}" fill="${col}" rx="1"/>`;
  }).join('');
}
export function walk(sc, n, { start = .5, vol = .09, drift = 0, min = .08, max = .92 } = {}) {
  let p = start; const out = [];
  for (let i = 0; i < n; i++) {
    const o = p; p = Math.min(max, Math.max(min, p + drift + (sc.rnd() - .5) * 2 * vol));
    const hi = Math.min(.97, Math.max(o, p) + sc.rnd() * vol * .8), lo = Math.max(.03, Math.min(o, p) - sc.rnd() * vol * .8);
    out.push([o, hi, lo, p]);
  }
  return out;
}
export function polyline(pts, stroke, w = 3, extra = '') { return `<polyline points="${pts.map((p) => p.map(f).join(',')).join(' ')}" fill="none" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`; }
export function gridLines(x, y, w, h, nx, ny, col = '#ffffff', op = .07) {
  let s = '';
  for (let i = 1; i < nx; i++) s += `<line x1="${f(x + w * i / nx)}" y1="${y}" x2="${f(x + w * i / nx)}" y2="${y + h}" stroke="${col}" stroke-opacity="${op}" stroke-width="1.5"/>`;
  for (let j = 1; j < ny; j++) s += `<line x1="${x}" y1="${f(y + h * j / ny)}" x2="${x + w}" y2="${f(y + h * j / ny)}" stroke="${col}" stroke-opacity="${op}" stroke-width="1.5"/>`;
  return s;
}

// question mark / exclamation drawn from paths (no fonts needed)
export function qmark(x, y, s = 1, col = C.crimson, w = 9) {
  return g(`<path d="M-14 -16 C-14 -34 14 -34 14 -14 C14 -2 0 0 0 14" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="32" r="${w * .62}" fill="${col}"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function bang(x, y, s = 1, col = C.crimson, w = 9) {
  return g(`<path d="M0 -30 L0 6" stroke="${col}" stroke-width="${w}" stroke-linecap="round"/><circle cx="0" cy="26" r="${w * .62}" fill="${col}"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function sweat(x, y, s = 1) {
  return g(`<path d="M0 -18 C10 -2 12 6 0 12 C-12 6 -10 -2 0 -18Z" fill="${C.ice}" stroke="#ffffff" stroke-width="2" stroke-opacity=".7"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function cursor(x, y, s = 1, col = '#fff') {
  return g(`<path d="M0 0 L0 30 L8 23 L14 36 L20 33 L14 21 L25 21 Z" fill="${col}" stroke="#1D1517" stroke-width="2.5" stroke-linejoin="round"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function clock(sc, x, y, r, minute = 40, hour = 10, face = C.paper, ring = C.crimson) {
  const ma = (minute / 60) * Math.PI * 2 - Math.PI / 2, ha = ((hour % 12) / 12 + minute / 720) * Math.PI * 2 - Math.PI / 2;
  let ticks = '';
  for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ticks += line(x + Math.cos(a) * r * .8, y + Math.sin(a) * r * .8, x + Math.cos(a) * r * .9, y + Math.sin(a) * r * .9, C.ink, r * .04); }
  return circ(x, y, r + 7, ring) + circ(x, y, r, face) + ticks + line(x, y, x + Math.cos(ha) * r * .5, y + Math.sin(ha) * r * .5, C.ink, r * .07) + line(x, y, x + Math.cos(ma) * r * .75, y + Math.sin(ma) * r * .75, C.ink, r * .045) + circ(x, y, r * .06, C.crimson);
}
export function mug(x, y, s = 1, col = C.paper) {
  return g(`<ellipse cx="0" cy="4" rx="30" ry="6" fill="#2a1218" opacity=".25"/><rect x="-22" y="-44" width="44" height="46" rx="8" fill="${col}"/><rect x="-22" y="-44" width="14" height="46" rx="6" fill="#fff" opacity=".35"/><path d="M22 -34 C42 -34 42 -8 22 -8" fill="none" stroke="${col}" stroke-width="7"/><ellipse cx="0" cy="-44" rx="22" ry="6" fill="#4A2A1E"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function paper(x, y, w, h, rot = 0, fill = '#FBF8F1', lines = 0, col = C.tan) {
  let l = ''; for (let i = 0; i < lines; i++) l += `<line x1="${w * .12}" y1="${h * (.18 + i * .8 / Math.max(lines, 1))}" x2="${w * (.5 + ((i * 37) % 40) / 100)}" y2="${h * (.18 + i * .8 / Math.max(lines, 1))}" stroke="${col}" stroke-width="3" stroke-linecap="round"/>`;
  return g(`<rect x="0" y="0" width="${w}" height="${h}" rx="3" fill="${fill}" stroke="#00000014" stroke-width="2"/>${l}`, `translate(${x} ${y}) rotate(${rot})`);
}
export function crumple(x, y, r = 22, fill = '#FBF8F1') {
  return g(`<path d="M-${r} 2 L-${r * .6} -${r * .8} L0 -${r} L${r * .7} -${r * .7} L${r} 0 L${r * .6} ${r * .8} L-${r * .1} ${r} L-${r * .8} ${r * .6} Z" fill="${fill}" stroke="#00000022" stroke-width="2" stroke-linejoin="round"/><path d="M-${r * .5} -${r * .2} L${r * .2} ${r * .1} L-${r * .1} ${r * .6} M${r * .1} -${r * .6} L${r * .3} ${r * .3}" stroke="#00000022" stroke-width="2" fill="none"/>`, `translate(${x} ${y})`);
}
export function books(x, y, s = 1) {
  const cols = [C.crimson, C.navy, C.tan, C.soft]; let o = '', yy = 0;
  [[120, 26], [104, 22], [112, 24], [92, 20]].forEach(([w, h], i) => { o += `<rect x="${-w / 2 + (i % 2) * 6}" y="${-yy - h}" width="${w}" height="${h}" rx="3" fill="${cols[i]}"/><rect x="${-w / 2 + (i % 2) * 6 + 8}" y="${-yy - h + 5}" width="${w - 30}" height="3" fill="#fff" opacity=".4"/>`; yy += h; });
  return g(o, `translate(${x} ${y}) scale(${s})`);
}
export function plant(sc, x, y, s = 1) {
  const leaves = [[-36, -150, -28], [-12, -190, -8], [18, -180, 14], [40, -138, 30], [-4, -120, 0]].map(([dx, dy, rot], i) => `<path d="M0 0 C-22 -38 -16 -${Math.abs(dy) - 18} ${dx} ${dy} C${dx + 34} ${dy + 40} 18 -40 0 0Z" fill="${i % 2 ? '#5E7F55' : '#4A6B47'}" transform="rotate(${rot * .4})"/>`).join('');
  return g(`<ellipse cx="0" cy="6" rx="48" ry="9" fill="#2a1218" opacity=".22"/>${leaves}<path d="M-34 -4 L-28 -62 L28 -62 L34 -4 Z" fill="${C.crimson}"/><rect x="-32" y="-72" width="64" height="14" rx="5" fill="${C.soft}"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function lamp(sc, x, y, s = 1) {
  return g(`<ellipse cx="0" cy="4" rx="40" ry="7" fill="#2a1218" opacity=".22"/><rect x="-26" y="-10" width="52" height="12" rx="6" fill="${C.charcoal}"/><path d="M0 -8 L-30 -104 L40 -150" stroke="${C.charcoal}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M26 -168 L66 -134 L50 -118 L22 -150Z" fill="${C.crimson}"/><path d="M30 -118 L60 -90 L20 -92Z" fill="${C.amber}" opacity=".25"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function dice(x, y, s = 1, rot = 12) {
  const pip = (a, b) => `<circle cx="${a}" cy="${b}" r="4.4" fill="${C.ink}"/>`;
  return g(`<ellipse cx="4" cy="30" rx="34" ry="7" fill="#2a1218" opacity=".25"/><rect x="-28" y="-28" width="56" height="56" rx="10" fill="${C.paper}" stroke="#00000022" stroke-width="2"/>${pip(-14, -14)}${pip(14, -14)}${pip(0, 0)}${pip(-14, 14)}${pip(14, 14)}`, `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
}
export function sticky(x, y, w, col = '#F2D56B', rot = 0, lines = 2, strike = false) {
  let l = ''; for (let i = 0; i < lines; i++) l += `<line x1="${w * .14}" y1="${w * (.28 + i * .18)}" x2="${w * (.82 - (i % 2) * .22)}" y2="${w * (.28 + i * .18)}" stroke="#7a6320" stroke-opacity=".6" stroke-width="3.5" stroke-linecap="round"/>`;
  const st = strike ? `<line x1="${w * .08}" y1="${w * .24}" x2="${w * .9}" y2="${w * (.28 + lines * .18)}" stroke="${C.down}" stroke-width="4.5" stroke-linecap="round"/>` : '';
  return g(`<rect width="${w}" height="${w}" rx="3" fill="${col}"/><rect width="${w}" height="${w * .14}" fill="#00000014"/>${l}${st}`, `translate(${x} ${y}) rotate(${rot})`);
}

/* ---------- devices ---------- */
// a monitor seen slightly from the side: frontal screen, a thin visible edge, skewed a touch
export function monitor(sc, x, y, w, h, content, { skew = -.07, stand = true, col = '#1d1a20' } = {}) {
  const clipId = sc.clip(`<rect x="0" y="0" width="${w}" height="${h}" rx="6"/>`);
  const glow = sc.rad([[0, C.ice, .22], [1, C.ice, 0]], .5, .5, .5);
  const body = `${stand ? `<path d="M${w / 2 - 14} ${h + 6} L${w / 2 - 22} ${h + 62} L${w / 2 + 22} ${h + 62} L${w / 2 + 14} ${h + 6}Z" fill="#3a3540"/><rect x="${w / 2 - 80}" y="${h + 58}" width="160" height="12" rx="6" fill="#2d2933"/>` : ''}
<rect x="-12" y="-12" width="${w + 24}" height="${h + 24}" rx="14" fill="${col}"/>
<rect x="-12" y="-12" width="${w + 24}" height="10" rx="5" fill="#fff" opacity=".07"/>
<rect x="0" y="0" width="${w}" height="${h}" rx="6" fill="${C.screen}"/>
<g clip-path="${clipId}">${content}<rect width="${w}" height="${h}" fill="${glow}"/><path d="M0 0 L${w * .5} 0 L${w * .22} ${h} L0 ${h}Z" fill="#fff" opacity=".035"/></g>`;
  const halo = ell(x + w / 2, y + h / 2, w * .72, h * .72, sc.rad([[0, C.ice, .20], [1, C.ice, 0]]));
  return halo + g(body, `translate(${x} ${y}) matrix(1 ${skew} 0 1 0 0)`);
}
export function laptop(sc, x, y, w, content, { skew = -.05 } = {}) {
  const h = w * .62, cid = sc.clip(`<rect width="${w}" height="${h}" rx="5"/>`);
  const halo = ell(x + w / 2, y + h / 2, w * .8, h * .8, sc.rad([[0, C.ice, .18], [1, C.ice, 0]]));
  let keys = '';
  for (let r = 0; r < 4; r++) { const y0 = h + 14 + r * 8.5, inset = -w * .02 * r, n = 15; for (let k = 0; k < n; k++) keys += `<rect x="${f(w * .02 + inset + k * (w * (1.0 - .04) - 2 * inset) / n)}" y="${f(y0)}" width="${f((w * .96 - 2 * inset) / n - 3)}" height="6" rx="1.5" fill="#6a6a74"/>`; }
  const deck = `<path d="M${-w * .04} ${h + 6} L${w * 1.04} ${h + 6} L${w * 1.14} ${h + 52} L${-w * .14} ${h + 52}Z" fill="#a9a9b3"/><path d="M${-w * .04} ${h + 6} L${w * 1.04} ${h + 6} L${w * 1.05} ${h + 14} L${-w * .05} ${h + 14}Z" fill="#c7c7d0"/>${keys}<rect x="${w * .38}" y="${h + 44}" width="${w * .24}" height="5" rx="2.5" fill="#8a8a94"/><path d="M${-w * .14} ${h + 52} L${w * 1.14} ${h + 52} L${w * 1.14} ${h + 62} L${-w * .14} ${h + 62}Z" fill="#7d7d88"/>`;
  return halo + shadow(sc, x + w / 2, y + h + 70, w * .62, 10, .25) + g(`<rect x="-10" y="-10" width="${w + 20}" height="${h + 20}" rx="10" fill="#1f1c22"/><rect width="${w}" height="${h}" rx="5" fill="${C.screen}"/><g clip-path="${cid}">${content}</g>${deck}`, `translate(${x} ${y}) matrix(1 ${skew} 0 1 0 0)`);
}
export function tablet(sc, x, y, w, h, content, { rot = -4 } = {}) {
  const cid = sc.clip(`<rect width="${w}" height="${h}" rx="14"/>`);
  const halo = ell(x + w / 2, y + h / 2, w * .9, h * .7, sc.rad([[0, C.ice, .18], [1, C.ice, 0]]));
  return halo + shadow(sc, x + w / 2, y + h + 56, w * .5, 9, .22) + g(`<path d="M${w * .46} ${h * .4} L${w * .66} ${h * .4} L${w * .74} ${h + 48} L${w * .5} ${h + 48}Z" fill="#4a4550"/><rect x="${w * .12}" y="${h + 40}" width="${w * .76}" height="12" rx="6" fill="#2d2933"/><rect x="-18" y="-18" width="${w + 36}" height="${h + 36}" rx="30" fill="#d9d4cd"/><rect x="-18" y="-18" width="${w + 36}" height="12" rx="6" fill="#fff" opacity=".35"/><rect x="-9" y="-9" width="${w + 18}" height="${h + 18}" rx="22" fill="#1d1a20"/><rect width="${w}" height="${h}" rx="14" fill="${C.screen}"/><g clip-path="${cid}">${content}</g><circle cx="${w / 2}" cy="-14" r="3" fill="#4a4550"/>`, `translate(${x} ${y}) rotate(${rot} ${w / 2} ${h})`);
}
export function pcTower(x, y, s = 1) {
  return g(`<ellipse cx="0" cy="6" rx="58" ry="9" fill="#2a1218" opacity=".25"/><rect x="-44" y="-170" width="88" height="172" rx="10" fill="#2a2630"/><rect x="-44" y="-170" width="16" height="172" rx="8" fill="#fff" opacity=".07"/><rect x="-26" y="-148" width="52" height="8" rx="4" fill="#15131a"/><rect x="-26" y="-130" width="52" height="8" rx="4" fill="#15131a"/><circle cx="0" cy="-60" r="12" fill="#15131a"/><circle cx="0" cy="-60" r="5" fill="${C.up}"/>`, `translate(${x} ${y}) scale(${s})`);
}
export function keyboard(x, y, w = 170, rot = 0) {
  let k = ''; for (let r = 0; r < 3; r++) for (let c = 0; c < 11; c++) k += `<rect x="${8 + c * (w - 16) / 11}" y="${6 + r * 12}" width="${(w - 16) / 11 - 3}" height="9" rx="2" fill="#4a4550"/>`;
  return g(`<rect width="${w}" height="46" rx="7" fill="#2d2933"/>${k}`, `translate(${x} ${y}) rotate(${rot})`);
}
export function mouse(x, y, s = 1) { return g(`<ellipse cx="0" cy="4" rx="26" ry="5" fill="#2a1218" opacity=".25"/><path d="M-20 0 C-20 -26 20 -26 20 0 Z" fill="#2d2933"/><line x1="0" y1="-22" x2="0" y2="-8" stroke="#15131a" stroke-width="2.5"/>`, `translate(${x} ${y}) scale(${s})`); }

/* ---------- room, desk, chair ---------- */
export function room(sc, { floorY, wall = [C.wallA, C.wallB], floor = [C.floorA, C.floorB], windowed = true, baseboard = C.paper } = {}) {
  const { w, h } = sc;
  let s = rr(-80, -80, w + 160, floorY + 80, 0, sc.lin([[0, wall[0]], [1, wall[1]]]));
  if (windowed) {
    s += poly([[w * .08, 0], [w * .38, 0], [w * .26, floorY], [w * -.04, floorY]], sc.lin([[0, '#fff', .55], [1, '#fff', 0]], [0, 0, 1, 1]), `filter="${sc.blur(14)}"`);
  }
  s += rr(-80, floorY - 22, w + 160, 22, 0, baseboard, 'opacity=".9"');
  s += rr(-80, floorY, w + 160, h - floorY + 80, 0, sc.lin([[0, floor[0]], [1, floor[1]]]));
  for (let i = 0; i < 9; i++) s += line(-40, floorY + 24 + i * (h - floorY) / 8, w + 40, floorY + 24 + i * (h - floorY) / 8, '#00000010', 2);
  return s;
}
export function deskSide(sc, x1, x2, y, { thick = 18, legH = 190, top = C.woodHi, edge = C.wood, leg = C.woodDk } = {}) {
  return `${shadow(sc, (x1 + x2) / 2, y + legH + 4, (x2 - x1) * .55, 12, .28)}
<rect x="${x2 - 36}" y="${y}" width="22" height="${legH}" fill="${leg}"/><rect x="${x1 + 70}" y="${y}" width="22" height="${legH}" fill="${leg}"/>
<rect x="${x1}" y="${y}" width="${x2 - x1}" height="${thick}" rx="5" fill="${edge}"/><rect x="${x1}" y="${y - 7}" width="${x2 - x1}" height="12" rx="5" fill="${top}"/><rect x="${x1 + 10}" y="${y - 5}" width="${(x2 - x1) * .7}" height="3" rx="2" fill="#fff" opacity=".25"/>`;
}
export function chair(sc, x, y, col = C.charcoal, accent = C.crimson) {
  // x,y = seat centre top. Profile view, backrest on the left
  return `${shadow(sc, x + 10, y + 192, 90, 12, .25)}
<rect x="${x - 6}" y="${y + 18}" width="14" height="124" fill="#3a3540"/>
<path d="M${x - 84} ${y + 160} L${x - 6} ${y + 140} L${x + 8} ${y + 140} L${x + 90} ${y + 160} L${x + 92} ${y + 170} L${x - 86} ${y + 170}Z" fill="#2d2933"/>
${circ(x - 80, y + 182, 10, '#1d1a20')}${circ(x + 84, y + 182, 10, '#1d1a20')}${circ(x + 2, y + 186, 10, '#1d1a20')}
<rect x="${x - 62}" y="${y - 2}" width="130" height="26" rx="13" fill="${col}"/>
<rect x="${x - 62}" y="${y - 2}" width="130" height="8" rx="4" fill="#fff" opacity=".1"/>
<path d="M${x - 66} ${y + 6} C${x - 86} ${y - 80} ${x - 84} ${y - 170} ${x - 66} ${y - 250} L${x - 40} ${y - 250} C${x - 54} ${y - 170} ${x - 52} ${y - 80} ${x - 40} ${y + 6}Z" fill="${col}"/>
<path d="M${x - 66} ${y - 250} L${x - 40} ${y - 250} L${x - 44} ${y - 210} L${x - 70} ${y - 210}Z" fill="${accent}"/>`;
}

/* ---------- the person (profile, facing right) ----------
   o: { x, y (hip on seat), s, skin, hair, top, jacket, pants, lean, tilt, face, sweat,
        near: { hand:[x,y], bend }, far: { hand:[x,y], bend } , fistNear }
   Returns { back, front }: draw back, then the desk, then front (the near arm). */
export function person(sc, o) {
  const { x, y, s = 1, skin = C.skinB, hair = C.hairA, top = C.shirt, jacket = null, pants = C.navy, lean = 8, tilt = 0, face = 'worry', beard = false } = o;
  const sk = skin, sleeve = jacket || top, cuff = top;
  const T = (inner, extra = '') => g(inner, `translate(${x} ${y}) scale(${s})${extra}`);
  // legs (seated, facing right)
  const legs = `<path d="M-30 -4 L96 -10 C112 -10 112 20 96 22 L-24 28Z" fill="${pants}"/><path d="M80 -8 L112 -6 L116 150 L84 152Z" fill="${pants}"/><path d="M84 148 L120 144 C150 144 164 156 160 166 L82 168Z" fill="#17131a"/><rect x="82" y="162" width="82" height="6" fill="#fff" opacity=".18"/>`;
  // torso: rotates around the hip
  const jk = jacket ? `<path d="M-40 -2 C-52 -80 -44 -170 -22 -214 L26 -214 C46 -170 52 -80 42 -2Z" fill="${jacket}"/><path d="M30 -208 L42 -2 L22 -2 L10 -190Z" fill="#fff" opacity=".08"/><path d="M18 -214 L40 -150 L26 -120 L8 -178Z" fill="${top}"/><path d="M14 -150 L22 -2" stroke="#00000030" stroke-width="3"/>` : `<path d="M-40 -2 C-52 -80 -44 -170 -22 -214 L26 -214 C46 -170 52 -80 42 -2Z" fill="${top}"/><path d="M30 -208 L42 -2 L22 -2 L10 -190Z" fill="#000" opacity=".06"/><path d="M-30 -140 C-10 -120 10 -120 28 -140" stroke="#00000014" stroke-width="3" fill="none"/>`;
  const tie = (o.tie) ? `<path d="M26 -206 L40 -196 L34 -120 L24 -112 L18 -190Z" fill="${o.tie}"/>` : '';
  const neck = `<path d="M-6 -236 L22 -236 L26 -204 L-8 -204Z" fill="${sk}"/><path d="M-6 -222 L22 -226 L22 -236 L-6 -236Z" fill="#000" opacity=".1"/>`;
  // head in profile, facing right; origin of the head group at the neck base
  const headCol = sk;
  const mouth = face === 'tired' ? `<path d="M44 -252 C48 -250 52 -251 55 -254" stroke="#5a2a22" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : face === 'blank' ? `<path d="M45 -252 L56 -252" stroke="#5a2a22" stroke-width="3" fill="none" stroke-linecap="round"/>`
    : `<path d="M44 -249 C48 -255 53 -255 56 -250" stroke="#5a2a22" stroke-width="3.2" fill="none" stroke-linecap="round"/>`;
  const brow = face === 'blank' ? `<path d="M34 -283 L52 -284" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>`
    : face === 'tired' ? `<path d="M34 -284 L50 -281" stroke="${hair}" stroke-width="4" stroke-linecap="round"/>`
    : `<path d="M32 -288 L52 -280" stroke="${hair}" stroke-width="4.5" stroke-linecap="round"/>`;
  const head = `<path d="M-26 -262 C-30 -320 -2 -346 30 -338 C52 -332 58 -306 58 -296 C58 -291 61 -287 64 -283 C66 -280 64 -277 61 -277 C62 -271 62 -267 59 -266 C61 -262 60 -258 57 -257 C58 -251 57 -246 52 -243 C50 -234 44 -229 34 -228 C24 -226 12 -226 2 -230 C-14 -232 -26 -246 -26 -262Z" fill="${headCol}"/>
<path d="M2 -230 C-14 -232 -26 -246 -26 -262 C-22 -246 -12 -236 4 -234Z" fill="#000" opacity=".12"/>
${beard ? `<path d="M6 -232 C-14 -232 -24 -248 -26 -262 L-18 -262 C-14 -250 -4 -246 10 -246 L40 -246 C46 -246 52 -244 52 -243 C50 -234 44 -229 34 -228 C24 -226 12 -226 6 -232Z" fill="${hair}" opacity=".9"/>` : ''}
<path d="M-28 -270 C-34 -330 -4 -352 30 -344 C46 -340 54 -328 56 -314 C48 -322 34 -324 22 -318 C8 -312 4 -296 6 -280 C0 -290 -6 -300 -14 -298 C-22 -296 -26 -284 -28 -270Z" fill="${hair}"/>
${ell(4, -272, 8, 12, skin, `stroke="#00000022" stroke-width="2"`)}
${ell(36, -279, 4, 5.4, '#1d1517')}${brow}${mouth}`;
  // arms
  const sh = [-4, -194];
  // head-space point -> hip-space point (applies the head tilt, then the torso lean)
  const hp = (p) => { const t = tilt * Math.PI / 180, r = lean * Math.PI / 180; const dx = p[0] - 10, dy = p[1] + 236;
    const qx = 10 + Math.cos(t) * dx - Math.sin(t) * dy, qy = -236 + Math.sin(t) * dx + Math.cos(t) * dy;
    return [Math.cos(r) * qx - Math.sin(r) * qy, Math.sin(r) * qx + Math.cos(r) * qy]; };
  const arm = (a, far) => {
    if (!a) return '';
    // arm coords are given in hip-space; the torso lean is applied to the shoulder
    const rad = lean * Math.PI / 180, S = [Math.cos(rad) * sh[0] - Math.sin(rad) * sh[1], Math.sin(rad) * sh[0] + Math.cos(rad) * sh[1]];
    const target = a.onHead ? hp(a.onHead) : a.hand;
    const r = ik(S, target, 92, 86, a.bend ?? 1);
    const [ex, ey] = r.elbow, [hx, hy] = r.hand;
    const col = far ? shade(sleeve, -.18) : sleeve, cc = far ? shade(cuff, -.18) : cuff, skn = far ? shade(sk, -.15) : sk;
    const hand = a.fist ? `<circle cx="${hx}" cy="${hy}" r="17" fill="${skn}"/><path d="M${hx - 8} ${hy - 12} L${hx + 10} ${hy - 12} M${hx - 10} ${hy - 3} L${hx + 12} ${hy - 3} M${hx - 10} ${hy + 6} L${hx + 12} ${hy + 6}" stroke="#00000028" stroke-width="2.4" fill="none" stroke-linecap="round"/>` : a.open ? `<ellipse cx="${hx}" cy="${hy}" rx="21" ry="15" fill="${skn}" transform="rotate(${a.rot ?? 0} ${hx} ${hy})"/><path d="M${hx - 4} ${hy - 5} L${hx + 20} ${hy - 7} M${hx - 4} ${hy + 1} L${hx + 22} ${hy + 1} M${hx - 4} ${hy + 7} L${hx + 19} ${hy + 9}" stroke="#00000026" stroke-width="2.2" stroke-linecap="round" transform="rotate(${a.rot ?? 0} ${hx} ${hy})"/>` : `<ellipse cx="${hx}" cy="${hy}" rx="17" ry="14" fill="${skn}" transform="rotate(${a.rot ?? 0} ${hx} ${hy})"/>`;
    return `<path d="M${S[0]} ${S[1]} L${ex} ${ey} L${hx} ${hy}" stroke="${col}" stroke-width="34" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M${S[0]} ${S[1]} L${ex} ${ey}" stroke="#000" stroke-opacity=".06" stroke-width="34" stroke-linecap="round" fill="none"/>${hand}`;
  };
  const sweatS = o.sweat ? `${sweat(66, -318, .9)}${sweat(-44, -312, .7)}` : '';
  const torsoG = g(jk + tie + neck + g(head, `rotate(${tilt} 10 -236)`), `rotate(${lean})`);
  return {
    back: T(legs) + T(arm(o.far, true)) + T(torsoG),
    front: T(arm(o.near, false) + sweatS),
    // anchors for callers (hip space → scene space)
    at: (px, py) => [x + px * s, y + py * s],
    // scene point -> hip space (for hand targets given in scene coordinates)
    loc: (sx, sy) => [(sx - x) / s, (sy - y) / s],
    // head-space point -> scene point (for placing marks near the face)
    headAt: (p) => { const q = hp(p); return [x + q[0] * s, y + q[1] * s]; },
  };
}
function shade(hex, a) {
  const n = parseInt(hex.slice(1), 16); let r = n >> 16, g2 = (n >> 8) & 255, b = n & 255;
  const t = a < 0 ? 0 : 255, p = Math.abs(a);
  r = Math.round((t - r) * p + r); g2 = Math.round((t - g2) * p + g2); b = Math.round((t - b) * p + b);
  return '#' + ((1 << 24) + (r << 16) + (g2 << 8) + b).toString(16).slice(1);
}
export { shade };

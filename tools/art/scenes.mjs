import { Scene, C, rr, circ, ell, path, line, poly, g, shadow, ik, candles, walk, polyline, gridLines, qmark, bang, sweat, cursor, clock, mug, paper, crumple, books, plant, lamp, dice, sticky, monitor, laptop, tablet, pcTower, keyboard, mouse, room, deskSide, chair, person, shade } from './kit.mjs';

export const SCENES = {};

/* ------------------------------------------------------------------
   missing — the trader who cannot read his charts (About › What was missing)
   ------------------------------------------------------------------ */
function missing() {
  const sc = new Scene(1600, 900, 11);
  const floorY = 700;
  sc.add(room(sc, { floorY }));
  // wall: pinned chart printouts, a clock, a window glow
  const wallChart = (x, y, w, h, rot, seed) => {
    const s2 = new Scene(1, 1, seed); const ser = walk(s2, 14, { vol: .16 });
    return g(`<rect width="${w}" height="${h}" rx="3" fill="#FBF8F1" stroke="#00000018" stroke-width="2"/>${gridLines(8, 8, w - 16, h - 16, 5, 4, '#000', .08)}${candles(10, 10, w - 20, h - 20, ser, { up: '#5a8d7c', down: '#c0566a', wick: 2 })}<line x1="${w * .1}" y1="${h * .75}" x2="${w * .9}" y2="${h * .2}" stroke="${C.crimson}" stroke-width="3"/><line x1="${w * .1}" y1="${h * .3}" x2="${w * .9}" y2="${h * .8}" stroke="${C.amber}" stroke-width="3"/>${circ(w / 2, -6, 7, C.crimson)}`, `translate(${x} ${y}) rotate(${rot})`);
  };
  sc.add(wallChart(930, 90, 220, 150, -4, 3) + wallChart(1180, 130, 190, 130, 3, 5) + wallChart(1420, 70, 150, 110, -2, 8) + wallChart(1000, 290, 170, 112, 2, 13));
  sc.add(clock(sc, 120, 150, 58, 52, 3));

  // desk, devices
  const deskY = 505;
  sc.add(deskSide(sc, 700, 1560, deskY, { legH: floorY + 40 - deskY }));
  // two screens
  const mk = (seed, w, h, up) => {
    const s2 = new Scene(1, 1, seed); let c = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 8, 5, '#fff', .07);
    c += candles(14, 18, w - 28, h - 36, walk(s2, 30, { vol: .13, start: .5 }), { wick: 2 });
    const ln = (col, n, off) => polyline(Array.from({ length: n }, (_, i) => [14 + i * (w - 28) / (n - 1), h * (.3 + s2.rnd() * .45) + off]), col, 3.2);
    c += ln(C.amber, 16, 0) + ln(C.ice, 12, 10) + ln('#C58CE8', 10, -10) + ln('#fff', 8, 0).replace('stroke-width="3.2"', 'stroke-width="2" stroke-dasharray="8 8"');
    c += `<rect x="${w * .06}" y="${h * .08}" width="${w * .26}" height="${h * .13}" rx="4" fill="#fff" opacity=".14"/><rect x="${w * .7}" y="${h * .76}" width="${w * .24}" height="${h * .13}" rx="4" fill="#fff" opacity=".14"/>`;
    return c;
  };
  sc.add(monitor(sc, 800, 215, 430, 260, mk(21, 430, 260), { skew: -.05 }));
  sc.add(monitor(sc, 1300, 255, 250, 215, mk(34, 250, 215), { skew: -.05 }));
  sc.add(keyboard(850, deskY - 24, 230, -1));
  sc.add(mouse(1130, deskY - 6, 1));
  sc.add(mug(1350, deskY - 6, 1, C.beige));
  sc.add(paper(1040, deskY - 40, 120, 80, 4, '#FBF8F1', 4) + crumple(1190, deskY - 22, 20) + crumple(760, deskY - 18, 17));

  // chair + person
  sc.add(chair(sc, 530, 590));
  const P = person(sc, { x: 560, y: 590, s: 1.16, skin: C.skinB, hair: C.hairA, top: C.shirt, jacket: '#3B3A47', pants: C.navy, lean: 16, tilt: 6, face: 'worry', sweat: false, tie: C.crimson,
    far: { onHead: [-14, -318], bend: -1 }, near: { onHead: [18, -344], bend: -1, open: true, rot: -18 } });
  sc.add(P.back);
  sc.add(P.front);
  // confusion above / around: question marks, a scribble, pat lines, sweat
  const hx = 700, hy = 205;
  sc.add(qmark(hx + 110, hy - 60, 1.4, C.crimson, 9) + qmark(hx - 30, hy - 100, 1.0, C.crimson, 8) + qmark(hx + 235, hy + 10, 1.0, C.soft, 8) + qmark(hx + 10, hy - 170, .8, C.rose, 7));
  sc.add(path(`M${hx + 40} ${hy - 95} c18 -26 52 -8 38 14 c-12 20 -44 6 -34 -14 c8 -16 34 -8 28 6`, 'none', `stroke="${C.crimson}" stroke-width="5" stroke-linecap="round" opacity=".75"`));
  const [fx, fy] = P.headAt([40, -300]);
  sc.add(path(`M${fx - 70} ${fy - 118} c-12 -10 -14 -24 -8 -34 M${fx - 38} ${fy - 128} c0 -14 6 -24 16 -30 M${fx - 4} ${fy - 114} c10 -8 22 -8 32 0`, 'none', `stroke="${C.crimson}" stroke-width="5" stroke-linecap="round" opacity=".85"`));
  sc.add(sweat(fx + 62, fy - 36, 1.1) + sweat(fx - 120, fy - 70, .8) + sweat(fx + 84, fy + 18, .8));
  // balled-up paper on the floor
  sc.add(crumple(300, 760, 24) + crumple(380, 790, 18) + crumple(240, 800, 20));
  sc.add(plant(sc, 1500, 700, 1.1));
  return sc.out({ wobble: 3.2, streak: .12 });
}
SCENES.missing = { build: missing, out: [1600, 900], q: .8 };

/* ------------------------------------------------------------------
   three traders at three terminals (Pathways hero + pathway panels)
   ------------------------------------------------------------------ */
const FLOOR = 650, DESK = 520;
function traderBase(seed, wallCol) {
  const sc = new Scene(1200, 900, seed);
  sc.add(room(sc, { floorY: FLOOR, wall: wallCol || [C.wallA, C.wallB] }));
  sc.add(deskSide(sc, 430, 1180, DESK, { legH: FLOOR + 50 - DESK }));
  return sc;
}
const P0 = { x: 300, y: 620, s: 1.25 };

// 1 — Market Readers: laptop, lacks knowledge
function readers() {
  const sc = traderBase(31);
  // bookshelf on the wall
  let shelf = rr(840, 150, 300, 14, 4, C.wood) + rr(840, 290, 300, 14, 4, C.wood);
  const cols = [C.crimson, C.navy, C.tan, C.soft, C.slate, C.beige, C.deep, C.sand];
  for (let i = 0; i < 9; i++) { const h = 96 + ((i * 37) % 34); shelf += rr(852 + i * 32, 150 - h, 28, h, 3, cols[i % cols.length]) + rr(856 + i * 32, 150 - h + 10, 20, 4, 2, '#fff', 'opacity=".35"'); }
  for (let i = 0; i < 7; i++) { const h = 100 + ((i * 53) % 30); shelf += rr(852 + i * 38, 290 - h, 33, h, 3, cols[(i + 3) % cols.length]) + rr(858 + i * 38, 290 - h + 12, 21, 4, 2, '#fff', 'opacity=".35"'); }
  sc.add(shelf);
  sc.add(sticky(740, 330, 70, '#F2D56B', -4, 2) + sticky(1010, 345, 64, '#F4B6A6', 5, 2));
  // laptop with an unreadable chart
  const w = 400, h = w * .62;
  const s2 = new Scene(1, 1, 7);
  let scr = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 6, 4, '#fff', .07) + candles(18, 30, w * .62, h - 60, walk(s2, 16, { vol: .1 }), { wick: 2.4 });
  scr += `<rect x="${w * .7}" y="14" width="${w * .27}" height="${h - 28}" rx="6" fill="#fff" opacity=".1"/>`;
  [.18, .34, .5, .66].forEach((t, i) => { scr += `<circle cx="${w * .75}" cy="${h * t + 8}" r="8" fill="${C.amber}" opacity=".85"/><rect x="${w * .79}" y="${h * t + 2}" width="${w * .14}" height="9" rx="4" fill="#fff" opacity="${.5 - i * .06}"/>`; });
  scr += qmark(w * .32, h * .5, 2.4, C.amber, 8);
  sc.add(laptop(sc, 650, DESK - 7 - h - 62, w, scr, { skew: -.04 }));
  sc.add(books(585, DESK - 7, .9));
  // open book + scribbled notes
  sc.add(g(`<path d="M0 0 L90 -14 L90 40 L0 54Z" fill="#FBF8F1"/><path d="M180 0 L90 -14 L90 40 L180 54Z" fill="#F1EADB"/><line x1="12" y1="12" x2="76" y2="2" stroke="${C.tan}" stroke-width="3"/><line x1="12" y1="24" x2="76" y2="14" stroke="${C.tan}" stroke-width="3"/><line x1="104" y1="2" x2="168" y2="12" stroke="${C.tan}" stroke-width="3"/><line x1="104" y1="14" x2="160" y2="22" stroke="${C.tan}" stroke-width="3"/>${circ(130, 34, 8, 'none', `stroke="${C.crimson}" stroke-width="3"`)}`, `translate(1000 ${DESK - 50})`));
  sc.add(mug(1150, DESK - 7, .9, C.beige));
  sc.add(chair(sc, 270, 620));
  const P = person(sc, { ...P0, skin: C.skinA, hair: C.hairB, top: '#F2EEE6', jacket: '#7A8CA0', pants: '#2E3446', lean: 10, tilt: 8, face: 'worry',
    far: { hand: P_loc(P0, 560, DESK - 22), bend: 1 }, near: { onHead: [12, -344], bend: -1, open: true, rot: -15 } });
  sc.add(P.back); sc.add(P.front);
  const [fx, fy] = P.headAt([30, -330]);
  sc.add(qmark(fx + 40, fy - 140, 1.3, C.crimson, 9) + qmark(fx - 60, fy - 175, .95, C.crimson, 8) + qmark(fx + 150, fy - 110, .8, C.soft, 7));
  sc.add(sweat(fx + 70, fy + 8, .9));
  return sc.out({ wobble: 3, streak: .12 });
}
function P_loc(p, sx, sy) { return [(sx - p.x) / p.s, (sy - p.y) / p.s]; }
SCENES.readers = { build: readers, out: [1200, 900], q: .8 };

// 2 — Market Operators: desktop PC, lacks execution
function operators() {
  const sc = traderBase(41, ['#EFE4D2', '#DCCBAE']);
  sc.add(clock(sc, 960, 190, 78, 22, 4) + sticky(740, 120, 74, '#F4B6A6', -3, 2));
  const w = 440, h = 270, my = DESK - 7 - h - 74;
  const s2 = new Scene(1, 1, 5);
  let scr = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 8, 5, '#fff', .06);
  // a clear plan: entry / stop / target, and price already past the target
  const base = walk(s2, 20, { start: .3, vol: .05, drift: .018, min: .12, max: .94 });
  scr += candles(14, 14, w * .62, h - 28, base, { wick: 2.6 });
  scr += `<line x1="14" y1="${h * .62}" x2="${w * .66}" y2="${h * .62}" stroke="${C.amber}" stroke-width="3" stroke-dasharray="9 7"/><line x1="14" y1="${h * .8}" x2="${w * .66}" y2="${h * .8}" stroke="${C.down}" stroke-width="3" stroke-dasharray="9 7"/><line x1="14" y1="${h * .3}" x2="${w * .66}" y2="${h * .3}" stroke="${C.up}" stroke-width="3" stroke-dasharray="9 7"/>`;
  // order ticket with an untouched BUY
  scr += `<rect x="${w * .71}" y="14" width="${w * .26}" height="${h - 28}" rx="8" fill="#fff" opacity=".1"/><rect x="${w * .74}" y="${h * .12}" width="${w * .2}" height="10" rx="5" fill="#fff" opacity=".5"/><rect x="${w * .74}" y="${h * .24}" width="${w * .14}" height="10" rx="5" fill="#fff" opacity=".3"/><rect x="${w * .74}" y="${h * .42}" width="${w * .2}" height="${h * .2}" rx="8" fill="${C.up}"/><path d="M${w * .84} ${h * .465} l-14 ${h * .1} h28z" fill="#fff"/><rect x="${w * .74}" y="${h * .68}" width="${w * .2}" height="${h * .2}" rx="8" fill="${C.down}" opacity=".85"/>`;
  scr += `<g transform="translate(${w * .83} ${h * .36}) scale(1.25)">${cursor(0, 0, 1)}</g>`;
  // checklist of ticks (the plan is ready)
  [.18, .34].forEach((t) => { scr += `<path d="M24 ${h * t + 6} l8 8 l14 -16" fill="none" stroke="${C.up}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`; });
  sc.add(monitor(sc, 640, my, w, h, scr, { skew: -.04 }));
  sc.add(pcTower(1130, DESK - 7, 1.05));
  sc.add(keyboard(560, DESK - 24, 190, 0));
  sc.add(mouse(505, DESK - 8, 1.15));
  sc.add(paper(820, DESK - 42, 110, 78, 3, '#FBF8F1', 4) + `<path d="M834 ${DESK - 22} l6 6 l11 -13 M834 ${DESK - 8} l6 6 l11 -13" stroke="${C.up}" stroke-width="4" fill="none" stroke-linecap="round"/>`);
  sc.add(chair(sc, 270, 620));
  const P = person(sc, { ...P0, skin: C.skinC, hair: C.hairA, top: '#F2EEE6', jacket: '#3B3A47', pants: C.navy, lean: 14, tilt: 4, face: 'worry', tie: C.crimson,
    far: { hand: P_loc(P0, 395, 560), bend: -1, fist: true }, near: { hand: P_loc(P0, 495, 470), bend: 1, open: true, rot: 8 } });
  sc.add(P.back); sc.add(P.front);
  const [fx, fy] = P.headAt([40, -300]);
  sc.add(sweat(fx + 40, fy - 70, 1) + sweat(fx - 80, fy - 30, .8));
  sc.add(path(`M500 438 c-12 -6 -18 -16 -16 -28 M526 432 c-2 -10 2 -20 10 -26`, 'none', `stroke="${C.crimson}" stroke-width="4.5" stroke-linecap="round" opacity=".8"`));
  return sc.out({ wobble: 3, streak: .12 });
}
SCENES.operators = { build: operators, out: [1200, 900], q: .8 };

// 3 — Market Thinkers: tablet, lacks consistency & systems
function thinkers() {
  const sc = traderBase(51, ['#F1E8D8', '#E0D2B6']);
  // sticky notes: rules that were written, then crossed out
  sc.add(sticky(780, 130, 86, '#F2D56B', -5, 3, true) + sticky(890, 110, 80, '#F4B6A6', 4, 3, true) + sticky(1000, 140, 90, '#BFDDC7', -2, 3, true) + sticky(850, 235, 80, '#F2D56B', 3, 2, true) + sticky(970, 255, 74, '#C9D8EC', -4, 2, false));
  const w = 255, h = 330, ty = DESK - 7 - h - 54;
  const s2 = new Scene(1, 1, 9);
  let scr = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 5, 6, '#fff', .07);
  // equity curve that cannot decide where it is going + uneven result bars
  const pts = [[16, .62], [52, .4], [88, .54], [124, .2], [160, .46], [196, .12], [238, .4]].map(([x, y]) => [x, 28 + y * (h * .38)]);
  scr += polyline(pts, C.amber, 6);
  const bars = [.8, -.5, .3, -.9, .6, -.2, 1, -.7, .4, -.35];
  const by = h * .74;
  bars.forEach((v, i) => { const bx = 16 + i * (w - 32) / bars.length, bh = Math.abs(v) * h * .15; scr += `<rect x="${bx}" y="${v > 0 ? by - bh : by}" width="${(w - 32) / bars.length - 5}" height="${bh}" rx="2" fill="${v > 0 ? C.up : C.down}"/>`; });
  scr += `<line x1="14" y1="${by}" x2="${w - 14}" y2="${by}" stroke="#fff" stroke-opacity=".4" stroke-width="2"/>`;
  sc.add(tablet(sc, 740, ty, w, h, scr, { rot: -3 }));
  sc.add(dice(640, DESK - 36, 1, 14) + dice(1070, DESK - 30, .8, -20));
  // notebook, pages with no structure
  sc.add(g(`<rect width="170" height="110" rx="6" fill="#FBF8F1" stroke="#00000018" stroke-width="2"/><path d="M14 28 c20 -14 30 14 50 0 s30 -14 50 0 M14 54 c18 12 34 -10 54 4 M14 80 c24 -10 34 12 60 0" fill="none" stroke="${C.crimson}" stroke-width="3.5" stroke-linecap="round" opacity=".8"/><circle cx="130" cy="70" r="16" fill="none" stroke="${C.soft}" stroke-width="3.5"/>`, `translate(1000 ${DESK - 28}) skewX(-12) scale(1 .38)`));
  sc.add(mug(560, DESK - 7, .9, C.paper));
  sc.add(chair(sc, 270, 620));
  const P = person(sc, { ...P0, skin: C.skinA, hair: C.hairC, top: '#F2EEE6', jacket: '#8C2740', pants: '#2E2A33', lean: 6, tilt: 2, face: 'tired', beard: true,
    far: { hand: P_loc(P0, 470, DESK - 20), bend: -1 }, near: { onHead: [34, -232], bend: 1, open: true, rot: 0 } });
  sc.add(P.back); sc.add(P.front);
  const [fx, fy] = P.headAt([40, -300]);
  sc.add(qmark(fx + 110, fy - 120, .9, C.crimson, 8) + bang(fx + 190, fy - 80, .7, C.crimson, 8));
  return sc.out({ wobble: 3, streak: .12 });
}
SCENES.thinkers = { build: thinkers, out: [1200, 900], q: .8 };

/* ------------------------------------------------------------------
   helpers for the poster-style scenes
   ------------------------------------------------------------------ */
function gear(cx, cy, r, teeth, fill, rot = 0, hole = .34) {
  const pts = [], tw = Math.PI * 2 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * tw + rot * Math.PI / 180;
    [[-.32, r * .86], [-.2, r], [.2, r], [.32, r * .86]].forEach(([k, rad]) => pts.push([cx + Math.cos(a + k * tw) * rad, cy + Math.sin(a + k * tw) * rad]));
  }
  const body = poly(pts, fill);
  const spokes = [0, 1, 2, 3, 4].map((i) => line(cx, cy, cx + Math.cos(rot + i * 1.2566) * r * .62, cy + Math.sin(rot + i * 1.2566) * r * .62, '#00000020', r * .09)).join('');
  return body + circ(cx, cy, r * .66, 'none', `stroke="#00000022" stroke-width="${r * .05}"`) + spokes + circ(cx, cy, r * hole, shade(fill, -.35)) + circ(cx, cy, r * hole * .5, shade(fill, .35));
}
function cardBase(sc, { glow = C.crimson, hill = '#E3D3B6' } = {}) {
  const { w, h } = sc;
  let s = rr(-60, -60, w + 120, h + 120, 0, sc.lin([[0, '#FBF7EE'], [.6, '#F1E8D8'], [1, '#EADDC6']]));
  s += circ(w * .62, 250, 280, sc.rad([[0, glow, .16], [1, glow, 0]]));
  // painted ground wash where the card text will sit
  s += path(`M-60 470 C200 430 420 500 640 462 C860 424 1040 480 1260 450 L1260 ${h + 60} L-60 ${h + 60}Z`, sc.lin([[0, hill, .95], [1, '#F1E8D8', 1]]));
  for (let i = 0; i < 6; i++) s += path(`M${-40 + i * 40} ${520 + i * 46} C300 ${500 + i * 46} 700 ${548 + i * 46} 1260 ${516 + i * 46}`, 'none', `stroke="#fff" stroke-opacity=".16" stroke-width="${14 + (i % 3) * 6}" stroke-linecap="round"`);
  return s;
}
function bird(x, y, s = 1, rot = -18, col = C.crimson) {
  return g(`<path d="M-48 -4 L-116 -30 L-104 8 L-50 12Z" fill="${shade(col, -.2)}"/><ellipse cx="0" cy="0" rx="62" ry="32" fill="${col}"/><path d="M-10 -8 C-30 -78 30 -92 54 -64 C30 -52 10 -34 -10 -8Z" fill="${shade(col, -.25)}"/><circle cx="52" cy="-16" r="22" fill="${col}"/><path d="M70 -20 L98 -12 L70 -6Z" fill="${C.amber}"/><circle cx="58" cy="-22" r="4.4" fill="#1d1517"/><path d="M-30 14 C0 26 30 24 52 8" stroke="#fff" stroke-opacity=".3" stroke-width="5" fill="none" stroke-linecap="round"/>`, `translate(${x} ${y}) rotate(${rot}) scale(${s})`);
}

/* ---------- How we choose: four painted card backgrounds ---------- */
SCENES.choose1 = { out: [1200, 800], q: .8, build() {
  const sc = new Scene(1200, 800, 61); sc.add(cardBase(sc));
  // complexity: a tangle that the lens resolves into one clear line
  const r = (a, b) => a + sc.rnd() * (b - a);
  let tangle = '';
  for (let i = 0; i < 9; i++) { const y0 = r(150, 360); tangle += path(`M60 ${y0} C${r(120, 260)} ${r(60, 420)} ${r(260, 380)} ${r(60, 420)} ${r(420, 520)} ${r(150, 360)} S${r(520, 600)} ${r(120, 380)} 560 ${y0 * .3 + 150}`, 'none', `stroke="${i % 3 ? '#A89580' : C.soft}" stroke-opacity="${i % 3 ? .55 : .5}" stroke-width="${i % 2 ? 5 : 3.5}" stroke-linecap="round"`); }
  sc.add(tangle);
  sc.add(circ(640, 262, 148, sc.rad([[0, '#fff', .75], [.7, '#fff', .35], [1, C.beige, .45]], .38, .34, .7)));
  sc.add(circ(640, 262, 148, 'none', `stroke="${C.crimson}" stroke-width="22"`));
  sc.add(path('M616 130 C560 140 520 190 514 240', 'none', 'stroke="#fff" stroke-opacity=".7" stroke-width="9" stroke-linecap="round"'));
  sc.add(g(rr(-16, 0, 32, 120, 14, C.deep) , 'translate(748 364) rotate(-42)'));
  sc.add(line(520, 262, 640, 262, C.crimson, 8) + line(640, 262, 1010, 262, C.crimson, 9) + circ(1048, 262, 30, 'none', `stroke="${C.crimson}" stroke-width="9"`) + circ(1048, 262, 9, C.crimson));
  sc.add(path('M960 238 L1010 262 L960 286', 'none', `stroke="${C.crimson}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"`));
  return sc.out({ wobble: 3, streak: .1 });
} };
SCENES.choose2 = { out: [1200, 800], q: .8, build() {
  const sc = new Scene(1200, 800, 62); sc.add(cardBase(sc));
  // prediction: a clouded crystal ball, set aside
  sc.add(g(`<ellipse cx="0" cy="170" rx="120" ry="20" fill="#2a1218" opacity=".18"/><path d="M-80 172 L-52 120 L52 120 L80 172Z" fill="${C.woodDk}"/><circle cx="0" cy="40" r="112" fill="${sc.rad([[0, '#fff', .8], [.5, '#CFC3E0', .55], [1, '#8E7FB0', .55]], .38, .32, .75)}"/><path d="M-60 20 C-30 -20 20 60 60 20 C30 60 -20 -10 -60 40" stroke="#fff" stroke-opacity=".6" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M20 -60 L4 -10 L34 18 L16 62" stroke="#4A3A60" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round" opacity=".7"/>`, 'translate(300 220)', 'opacity=".62"'));
  // execution: the arrow lands
  const cx = 800, cy = 262; let t = '';
  [150, 118, 86, 54, 24].forEach((rad, i) => { t += circ(cx, cy, rad, i % 2 ? C.paper : C.crimson, `stroke="${C.deep}" stroke-opacity=".35" stroke-width="3"`); });
  sc.add(`<ellipse cx="${cx + 8}" cy="${cy + 170}" rx="150" ry="14" fill="#2a1218" opacity=".18"/>` + g(`<path d="M-40 160 L0 -0 L40 160" stroke="${C.woodDk}" stroke-width="12" fill="none" stroke-linecap="round"/>`, `translate(${cx} ${cy + 0})`) + t);
  sc.add(g(`<line x1="0" y1="0" x2="260" y2="0" stroke="${C.wood}" stroke-width="9" stroke-linecap="round"/><path d="M-26 0 L10 -12 L10 12Z" fill="#cfc9c2"/><path d="M200 0 L276 -34 L262 0 L276 34Z" fill="${C.crimson}"/><path d="M236 0 L296 -22 L286 0 L296 22Z" fill="${C.soft}"/>`, `translate(${cx} ${cy}) rotate(-24)`));
  sc.add(line(1040, 70, 1130, 34, C.crimson, 4, 'opacity=".3"') + line(1070, 110, 1160, 72, C.crimson, 4, 'opacity=".3"') + line(1000, 40, 1060, 16, C.crimson, 4, 'opacity=".3"'));
  return sc.out({ wobble: 3, streak: .1 });
} };
SCENES.choose3 = { out: [1200, 800], q: .8, build() {
  const sc = new Scene(1200, 800, 63); sc.add(cardBase(sc));
  // motivation: a candle that flickers and sags
  sc.add(g(`<ellipse cx="0" cy="170" rx="70" ry="12" fill="#2a1218" opacity=".18"/><rect x="-34" y="20" width="68" height="150" rx="10" fill="${C.paper}" stroke="#00000018" stroke-width="2"/><rect x="-34" y="20" width="22" height="150" rx="10" fill="#fff" opacity=".5"/><path d="M-34 36 C-34 70 -22 80 -22 52 L-10 36Z" fill="#fff"/><ellipse cx="0" cy="20" rx="34" ry="9" fill="#EFE6D3"/><line x1="0" y1="20" x2="4" y2="2" stroke="#1d1517" stroke-width="4" stroke-linecap="round"/><path d="M4 2 C-22 -26 6 -48 20 -92 C40 -50 44 -20 4 2Z" fill="${C.amber}" opacity=".9"/><path d="M5 -2 C-6 -16 8 -28 14 -52 C26 -28 22 -10 5 -2Z" fill="#fff" opacity=".8"/><path d="M26 -110 c20 -22 -14 -34 6 -60" stroke="#8a7f78" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>`, 'translate(280 230)', 'opacity=".78"'));
  // systems: gears that keep turning
  sc.add(gear(780, 250, 128, 14, C.crimson, 4) + gear(1010, 190, 84, 10, C.soft, 16) + gear(960, 372, 62, 8, C.tan, 8, .3) + gear(610, 366, 70, 9, C.beige === '' ? C.sand : '#B89F78', 2, .3));
  sc.add(path('M890 156 q30 -46 76 -34 M1060 266 q22 34 6 70 M850 392 q40 28 78 8', 'none', `stroke="${C.crimson}" stroke-opacity=".5" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 14"`));
  return sc.out({ wobble: 3, streak: .1 });
} };
SCENES.choose4 = { out: [1200, 800], q: .8, build() {
  const sc = new Scene(1200, 800, 64); sc.add(cardBase(sc, { glow: '#E3A93B' }));
  // dawn behind the hills
  sc.add(circ(930, 372, 150, sc.rad([[0, '#F7D58A', .95], [.7, '#F2C26B', .5], [1, '#F2C26B', 0]])));
  for (let i = 0; i < 9; i++) { const a = Math.PI + i * Math.PI / 8; sc.add(line(930 + Math.cos(a) * 180, 372 + Math.sin(a) * 180, 930 + Math.cos(a) * 230, 372 + Math.sin(a) * 230, '#F2C26B', 8, 'opacity=".5"')); }
  // dependency: the cage, door open
  let cage = '';
  for (let i = -5; i <= 5; i++) cage += `<path d="M${i * 24} 148 C${i * 24 * 1.1} 60 ${i * 15} -4 0 -62" stroke="${C.deep}" stroke-width="5" fill="none"/>`;
  sc.add(g(`<ellipse cx="0" cy="190" rx="130" ry="14" fill="#2a1218" opacity=".18"/>${cage}<ellipse cx="0" cy="150" rx="140" ry="22" fill="${C.deep}"/><ellipse cx="0" cy="140" rx="140" ry="20" fill="${C.crimson}"/><circle cx="0" cy="-70" r="12" fill="none" stroke="${C.deep}" stroke-width="6"/><path d="M-96 100 C-96 40 -80 8 -52 -22" stroke="${C.deep}" stroke-width="5" fill="none"/><path d="M96 90 L150 40 L170 70 L110 128Z" fill="none" stroke="${C.deep}" stroke-width="5" stroke-linejoin="round"/>`, 'translate(300 200)'));
  sc.add(bird(640, 190, 1.0, -22) + bird(820, 118, .5, -28, C.soft));
  sc.add(path('M470 250 q70 -4 120 -34 M470 280 q60 6 110 -18', 'none', `stroke="${C.crimson}" stroke-opacity=".35" stroke-width="5" stroke-linecap="round" stroke-dasharray="3 14"`));
  return sc.out({ wobble: 3, streak: .1 });
} };

/* ---------- About hero: the institution ---------- */
SCENES.institution = { out: [1200, 900], q: .8, build() {
  const sc = new Scene(1200, 900, 71);
  const sky = rr(-60, -60, 1320, 1020, 0, sc.lin([[0, '#FBF7EE'], [.55, '#F1E7D4'], [1, '#E3D3B6']]));
  sc.add(sky);
  sc.add(circ(930, 250, 190, sc.rad([[0, C.crimson, .2], [1, C.crimson, 0]])));
  sc.add(circ(930, 250, 78, C.beige, 'opacity=".75"'));
  // markets in the sky: a rising line, very faint
  sc.add(polyline([[40, 330], [150, 290], [230, 310], [340, 220], [430, 250], [540, 150], [650, 170], [760, 90], [900, 110], [1140, 40]], C.crimson, 5, 'opacity=".22" stroke-dasharray="2 14"'));
  // side wings
  const wing = (x, w2, col) => rr(x, 430, w2, 330, 4, col) + Array.from({ length: 3 }, (_, r) => Array.from({ length: Math.floor(w2 / 60) }, (_, c) => rr(x + 18 + c * 52, 462 + r * 90, 28, 52, 14, '#F5E7C8', 'opacity=".8"')).join('')).join('');
  sc.add(wing(40, 250, '#C9B796') + wing(910, 250, '#C9B796'));
  // steps
  for (let i = 0; i < 5; i++) sc.add(rr(180 - i * 26, 700 + i * 22, 840 + i * 52, 30, 4, sc.lin([[0, i % 2 ? '#E8DCC2' : '#F2E9D6'], [1, '#CDBB9A']])));
  sc.add(shadow(sc, 600, 826, 520, 14, .2));
  // body of the building
  sc.add(rr(300, 390, 600, 310, 0, sc.lin([[0, '#6a1a2c'], [1, C.deep]])));
  sc.add(rr(520, 470, 160, 230, 80, sc.lin([[0, '#F7D58A'], [1, '#C98B3A']])) + rr(536, 486, 128, 214, 64, '#6a1a2c', 'opacity=".55"'));
  // columns
  for (let i = 0; i < 6; i++) {
    const x = 306 + i * 108, gr = sc.lin([[0, '#FFFDF8'], [.55, '#EFE5D0'], [1, '#C8B898']], [0, 0, 1, 0]);
    sc.add(rr(x, 392, 56, 296, 2, gr) + rr(x - 8, 380, 72, 18, 4, '#F6EEDD') + rr(x - 8, 686, 72, 16, 3, '#E2D5BA'));
    for (let k = 1; k < 4; k++) sc.add(line(x + k * 14, 402, x + k * 14, 682, '#00000012', 2));
  }
  // entablature + pediment
  sc.add(rr(276, 336, 648, 48, 3, sc.lin([[0, '#FBF4E4'], [1, '#E2D5BA']])) + rr(276, 372, 648, 14, 0, C.crimson));
  sc.add(poly([[256, 340], [944, 340], [600, 196]], sc.lin([[0, '#FDF8EC'], [1, '#E5D8BC']])) + poly([[330, 328], [870, 328], [600, 224]], C.crimson) + poly([[360, 322], [840, 322], [600, 240]], C.deep, 'opacity=".5"'));
  // emblem: three pillars rising to a peak (echoes the logo)
  sc.add(poly([[600, 238], [632, 318], [568, 318]], '#EDE6DC') + [-18, -6, 6, 18].map((dx) => rr(600 + dx - 3, 270 + Math.abs(dx) * .9, 6, 48 - Math.abs(dx) * .9, 2, '#fff', 'opacity=".85"')).join(''));
  // cypress trees
  const tree = (x, s2) => g(`<ellipse cx="0" cy="12" rx="40" ry="8" fill="#2a1218" opacity=".2"/><path d="M0 -240 C40 -160 44 -60 22 10 L-22 10 C-44 -60 -40 -160 0 -240Z" fill="#4A6B47"/><path d="M0 -240 C-40 -160 -44 -60 -22 10 L-6 10 C-22 -80 -16 -170 0 -240Z" fill="#5E7F55" opacity=".7"/>`, `translate(${x} 770) scale(${s2})`);
  sc.add(tree(86, 1.0) + tree(1120, 1.05) + tree(210, .7) + tree(1000, .7));
  // three people climbing the steps with bags
  const walker = (x, y, s2, suit, bag) => g(`<ellipse cx="0" cy="102" rx="34" ry="7" fill="#2a1218" opacity=".25"/><path d="M-12 40 L-16 100 M10 40 L18 98" stroke="#1d1a24" stroke-width="13" stroke-linecap="round"/><path d="M-24 -26 C-30 20 -24 52 -20 58 L24 58 C28 40 30 0 24 -26Z" fill="${suit}"/><path d="M-24 -26 L-8 -30 L-4 -4Z" fill="#fff" opacity=".85"/><circle cx="0" cy="-48" r="21" fill="${bag.skin}"/><path d="M-22 -50 C-22 -76 20 -78 22 -52 C10 -62 -8 -60 -22 -50Z" fill="${bag.hair}"/><rect x="${bag.side}" y="6" width="40" height="30" rx="5" fill="${C.crimson}" stroke="${C.deep}" stroke-width="2"/><path d="M${bag.side + 8} 6 L${bag.side + 8} -2 L${bag.side + 32} -2 L${bag.side + 32} 6" stroke="${C.deep}" stroke-width="3" fill="none"/>`, `translate(${x} ${y}) scale(${s2})`);
  sc.add(walker(470, 728, 1.15, '#2E2A33', { skin: C.skinB, hair: C.hairA, side: 14 }) + walker(640, 770, 1.3, '#233246', { skin: C.skinA, hair: C.hairC, side: -52 }) + walker(780, 740, 1.12, '#4A0817', { skin: C.skinC, hair: C.hairA, side: 12 }));
  return sc.out({ wobble: 3, streak: .1 });
} };

/* ---------- Intelligence: three ways knowing more does not help ---------- */
function deskStrip(sc, y = 700) { return rr(-60, y, 1320, 260, 0, sc.lin([[0, C.woodHi], [1, C.wood]])) + rr(-60, y, 1320, 10, 0, '#fff', 'opacity=".25"'); }
SCENES.hesitation = { out: [1200, 900], q: .8, build() {
  const sc = new Scene(1200, 900, 81);
  sc.add(rr(-60, -60, 1320, 1020, 0, sc.lin([[0, '#F6EFE0'], [1, '#E0D0B2']])));
  sc.add(deskStrip(sc, 720));
  const s2 = new Scene(1, 1, 3); const w = 790, h = 500;
  let scr = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 8, 5, '#fff', .06);
  scr += candles(24, 30, w * .6, h - 60, walk(s2, 22, { start: .25, vol: .05, drift: .03, min: .1, max: .96 }), { wick: 3 });
  scr += `<line x1="24" y1="${h * .55}" x2="${w * .64}" y2="${h * .55}" stroke="${C.amber}" stroke-width="4" stroke-dasharray="12 9"/>`;
  scr += `<rect x="${w * .68}" y="24" width="${w * .3}" height="${h - 48}" rx="12" fill="#fff" opacity=".1"/><rect x="${w * .72}" y="${h * .12}" width="${w * .22}" height="12" rx="6" fill="#fff" opacity=".5"/><rect x="${w * .72}" y="${h * .22}" width="${w * .14}" height="12" rx="6" fill="#fff" opacity=".3"/><rect x="${w * .71}" y="${h * .42}" width="${w * .26}" height="${h * .22}" rx="12" fill="${C.up}"/><path d="M${w * .84} ${h * .465} l-22 ${h * .12} h44z" fill="#fff"/><rect x="${w * .71}" y="${h * .7}" width="${w * .26}" height="${h * .18}" rx="12" fill="${C.down}" opacity=".8"/>`;
  sc.add(monitor(sc, 90, 90, w, h, scr, { skew: 0 }));
  // a hand that reaches for the button and stops short of it
  sc.add(g(`<rect x="70" y="-62" width="300" height="124" rx="22" fill="#3B3A47"/><rect x="70" y="-62" width="300" height="22" rx="11" fill="#fff" opacity=".08"/><rect x="62" y="-58" width="30" height="116" rx="8" fill="#F5F0E8"/>
<rect x="-24" y="-48" width="104" height="104" rx="30" fill="${C.skinB}"/>
<rect x="-150" y="-36" width="150" height="26" rx="13" fill="${C.skinB}"/><path d="M-138 -34 L-20 -34" stroke="#fff" stroke-opacity=".25" stroke-width="4" stroke-linecap="round"/>
<rect x="-40" y="4" width="64" height="22" rx="11" fill="${shade(C.skinB, -.12)}"/><rect x="-36" y="26" width="62" height="22" rx="11" fill="${shade(C.skinB, -.2)}"/><rect x="-30" y="48" width="56" height="20" rx="10" fill="${shade(C.skinB, -.28)}"/>
<rect x="-40" y="-72" width="74" height="26" rx="13" fill="${C.skinB}" transform="rotate(-12 -4 -60)"/>`, 'translate(1075 420)'));
  sc.add(cursor(790, 365, 1.5));
    sc.add(path('M975 340 c-10 -30 -30 -48 -56 -52 M1000 312 c-6 -34 -26 -62 -52 -76', 'none', `stroke="${C.crimson}" stroke-width="5" stroke-linecap="round" stroke-dasharray="2 13" opacity=".85"`));
  sc.add(sweat(1060, 330, 1.4) + sweat(1110, 372, .95));
  sc.add(clock(sc, 150, 790, 82, 58, 9) + path('M150 690 A100 100 0 1 1 90 720', 'none', `stroke="${C.crimson}" stroke-width="7" stroke-linecap="round" stroke-dasharray="4 14"`));
  return sc.out({ wobble: 3, streak: .1 });
} };
SCENES.conflict = { out: [1200, 900], q: .8, build() {
  const sc = new Scene(1200, 900, 82);
  sc.add(rr(-60, -60, 1320, 1020, 0, sc.lin([[0, '#F6EFE0'], [1, '#DFCFB1']])));
  sc.add(deskStrip(sc, 730));
  const mk = (seed, up) => { const s2 = new Scene(1, 1, seed); const w = 470, h = 330; let c = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 6, 4, '#fff', .06);
    c += candles(20, 24, w - 40, h - 48, walk(s2, 16, { start: up ? .15 : .85, vol: .04, drift: up ? .05 : -.05, min: .06, max: .96 }), { wick: 3 });
    c += `<path d="${up ? `M30 ${h * .85} L${w - 40} ${h * .12}` : `M30 ${h * .15} L${w - 40} ${h * .88}`}" stroke="${up ? C.up : C.down}" stroke-width="7" stroke-linecap="round" stroke-dasharray="2 16" opacity=".9"/>`; return c; };
  sc.add(monitor(sc, 90, 200, 470, 330, mk(5, true), { skew: .04 }));
  sc.add(monitor(sc, 640, 200, 470, 330, mk(8, false), { skew: -.04 }));
  // opposite arrows
  sc.add(g(`<path d="M0 0 L46 64 L22 64 L22 130 L-22 130 L-22 64 L-46 64Z" fill="${C.up}"/>`, 'translate(325 30)') + g(`<path d="M0 130 L46 66 L22 66 L22 0 L-22 0 L-22 66 L-46 66Z" fill="${C.down}"/>`, 'translate(875 30)'));
  // a trader between the two, seen from behind
  sc.add(`<path d="M360 900 C370 790 440 760 600 756 C760 760 830 790 840 900Z" fill="#3B3A47"/><path d="M560 760 L640 760 L640 700 L560 700Z" fill="${C.skinB}"/><ellipse cx="600" cy="640" rx="76" ry="88" fill="${C.skinB}"/><path d="M524 636 C520 560 580 540 612 548 C666 550 684 590 676 640 C660 610 640 596 600 596 C566 596 540 610 524 636Z" fill="${C.hairA}"/><ellipse cx="524" cy="648" rx="11" ry="18" fill="${C.skinB}"/><ellipse cx="676" cy="648" rx="11" ry="18" fill="${C.skinB}"/><path d="M524 636 C524 700 560 726 600 726 C640 726 676 700 676 636 C660 690 640 700 600 700 C560 700 540 690 524 636Z" fill="${C.hairA}" opacity=".55"/><path d="M510 800 L540 760 M690 800 L660 760" stroke="#00000030" stroke-width="5"/>`);
  sc.add(qmark(600, 500, 1.6, C.crimson, 11) + qmark(440, 620, .9, C.soft, 8) + qmark(760, 620, .9, C.soft, 8));
  return sc.out({ wobble: 3, streak: .1 });
} };
SCENES.inconsistent = { out: [1200, 900], q: .8, build() {
  const sc = new Scene(1200, 900, 83);
  sc.add(rr(-60, -60, 1320, 1020, 0, sc.lin([[0, '#F6EFE0'], [1, '#E0D0B2']])));
  sc.add(sticky(80, 70, 120, '#F2D56B', -4, 3, true) + sticky(230, 50, 110, '#F4B6A6', 5, 3, true) + sticky(1000, 80, 120, '#BFDDC7', 3, 3, true) + sticky(880, 40, 100, '#C9D8EC', -5, 2, true));
  sc.add(deskStrip(sc, 740));
  const w = 880, h = 480; let scr = `<rect width="${w}" height="${h}" fill="${C.screen}"/>` + gridLines(0, 0, w, h, 8, 5, '#fff', .06);
  scr += polyline([[30, .7], [100, .45], [160, .6], [230, .2], [300, .55], [370, .12], [440, .5], [510, .3], [580, .62], [650, .18], [720, .46], [800, .24], [850, .5]].map(([x, y]) => [x, 30 + y * h * .5]), C.amber, 7);
  const bars = [.8, -.5, .3, -.9, .6, -.2, 1, -.7, .4, -.35, .75, -.6, .25, -.85]; const by = h * .8;
  bars.forEach((v, i) => { const bw = (w - 60) / bars.length, bh = Math.abs(v) * h * .16; scr += `<rect x="${30 + i * bw}" y="${v > 0 ? by - bh : by}" width="${bw - 8}" height="${bh}" rx="3" fill="${v > 0 ? C.up : C.down}"/>`; });
  scr += `<line x1="24" y1="${by}" x2="${w - 24}" y2="${by}" stroke="#fff" stroke-opacity=".4" stroke-width="2.5"/>`;
  sc.add(monitor(sc, 160, 130, w, h, scr, { skew: 0 }));
  sc.add(dice(250, 770, 1.5, 16) + dice(390, 810, 1.1, -24) + dice(1010, 790, 1.2, 8));
  // coins, stacked differently each time
  [[640, 4], [720, 7], [800, 2], [880, 6]].forEach(([x, n]) => { for (let i = 0; i < n; i++) sc.add(ell(x, 830 - i * 14, 36, 11, i % 2 ? '#E3A93B' : '#F0C165', 'stroke="#8a5b12" stroke-width="2.5" stroke-opacity=".5"')); });
  return sc.out({ wobble: 3, streak: .1 });
} };

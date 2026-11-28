// Boxer — neon "hologram" fighter drawn as SVG. Seen in profile, facing right.
// Each pose is a set of joint angles (degrees, SVG convention: 0 = right, +90 = down).

const ORANGE = '#ff7a1a';
const CORE = '#ffd2a6';
const SHELL = '#140904';

const POSES = {
  guard:  { lead: [60, -80], rear: [75, -75], lean: 0, dip: 0, shift: 0 },
  idle:   { lead: [60, -80], rear: [75, -75], lean: 0, dip: 0, shift: 0 },
  jab:    { lead: [-2, -2], rear: [75, -75], lean: 4, dip: 0, shift: 0 },
  cross:  { lead: [62, -95], rear: [-6, -2], lean: 10, dip: 0, shift: 4 },
  hookL:  { lead: [-22, -62], rear: [75, -75], lean: 8, dip: 3, shift: 0 },
  hookR:  { lead: [62, -95], rear: [-22, -58], lean: 14, dip: 3, shift: 4 },
  upperL: { lead: [35, -80], rear: [75, -75], lean: 6, dip: 14, shift: 2 },
  upperR: { lead: [62, -95], rear: [30, -78], lean: 12, dip: 14, shift: 5 },
  slip:   { lead: [65, -85], rear: [80, -75], lean: -10, dip: 12, shift: -4 },
  step:   { lead: [60, -80], rear: [75, -75], lean: -3, dip: 0, shift: -14 },
};

export const POSE_NAMES = Object.keys(POSES);

const UPPER = 30;
const FORE = 28;
const rad = (d) => (d * Math.PI) / 180;
const add = ([x, y], a, l) => [x + Math.cos(rad(a)) * l, y + Math.sin(rad(a)) * l];

// Returns the drawable geometry for a pose state.
function geometry(p, bounce = 0) {
  const bx = 100 + p.shift;
  const by = bounce + p.dip * 0.4;
  const hipF = [bx + 8, 172 + by];
  const hipB = [bx - 6, 172 + by];
  const lean = p.lean;
  const neck = [bx + 6 + lean, 96 + by + p.dip];
  const head = [bx + 12 + lean * 1.2, 72 + by + p.dip * 1.1];
  const shF = [neck[0] + 9, neck[1] + 10];
  const shB = [neck[0] - 11, neck[1] + 8];
  const elF = add(shF, p.lead[0], UPPER);
  const fiF = add(elF, p.lead[1], FORE);
  const elB = add(shB, p.rear[0], UPPER);
  const fiB = add(elB, p.rear[1], FORE);
  const kneeF = [bx + 24, 216 + by * 0.5];
  const ankF = [bx + 32 - p.shift * 0.2, 266];
  const kneeB = [bx - 16, 216 + by * 0.5];
  const ankB = [bx - 32 - p.shift * 0.4, 266];
  const torso = `M${shB[0] - 6} ${shB[1] - 2} L${shF[0] + 5} ${shF[1] - 3}` +
    ` Q${shF[0] + 14} ${shF[1] + 22} ${hipF[0] + 4} ${hipF[1] - 14}` +
    ` L${hipF[0] + 3} ${hipF[1]} L${hipB[0] - 5} ${hipB[1]}` +
    ` Q${shB[0] - 14} ${shB[1] + 34} ${shB[0] - 6} ${shB[1] - 2} Z`;
  const shorts = `M${hipB[0] - 7} ${hipF[1] - 8} L${hipF[0] + 6} ${hipF[1] - 8}` +
    ` L${hipF[0] + 14} ${hipF[1] + 26} L${bx} ${hipF[1] + 20} L${hipB[0] - 14} ${hipF[1] + 26} Z`;
  return {
    head: { x: head[0], y: head[1], r: 14 },
    torso,
    shorts,
    // back limbs first so front limbs overlap them
    limbs: [
      [hipB, kneeB, 21], [kneeB, ankB, 15], [ankB, [ankB[0] - 14, ankB[1] + 2], 9],
      [shB, elB, 17], [elB, fiB, 14],
      [hipF, kneeF, 22], [kneeF, ankF, 16], [ankF, [ankF[0] + 15, ankF[1] + 2], 9],
      [neck, [neck[0] + 2, neck[1] + 10], 15],
      [shF, elF, 18], [elF, fiF, 15],
    ],
    gloves: [
      { x: fiB[0], y: fiB[1], r: 11 },
      { x: fiF[0], y: fiF[1], r: 12 },
    ],
  };
}

function segMarkup([a, b, w]) {
  const d = `M${a[0].toFixed(1)} ${a[1].toFixed(1)} L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  return `<path d="${d}" stroke="${ORANGE}" stroke-width="${w + 3}" stroke-linecap="round"/>` +
    `<path d="${d}" stroke="${SHELL}" stroke-width="${w - 1}" stroke-linecap="round"/>` +
    `<path d="${d}" stroke="${CORE}" stroke-width="1.1" stroke-linecap="round" opacity=".55"/>`;
}

function svgMarkup(g, extraClass = '') {
  const c = (o, fill = SHELL) =>
    `<circle cx="${o.x.toFixed(1)}" cy="${o.y.toFixed(1)}" r="${o.r}" fill="${fill}" stroke="${ORANGE}" stroke-width="2.6"/>`;
  return `<svg class="fighter-svg ${extraClass}" viewBox="0 20 200 270" fill="none" aria-hidden="true">` +
    `<ellipse cx="100" cy="270" rx="70" ry="7" fill="${ORANGE}" opacity=".18"/>` +
    g.limbs.slice(0, 5).map(segMarkup).join('') +
    `<path d="${g.torso}" fill="${SHELL}" stroke="${ORANGE}" stroke-width="2.6" stroke-linejoin="round"/>` +
    `<path d="${g.torso}" fill="none" stroke="${CORE}" stroke-width="1" opacity=".35" transform="translate(3 6) scale(.97)"/>` +
    g.limbs.slice(5, 8).map(segMarkup).join('') +
    `<path d="${g.shorts}" fill="#2a1005" stroke="${ORANGE}" stroke-width="2.4" stroke-linejoin="round"/>` +
    g.limbs.slice(8).map(segMarkup).join('') +
    c(g.head) +
    g.gloves.map((o) => c(o, '#3a1606')).join('') +
    `</svg>`;
}

const THUMB_POSES = ['guard', 'jab', 'cross', 'hookL', 'upperR', 'slip', 'hookR'];

export function poseSVG(name, extraClass = '') {
  return svgMarkup(geometry(POSES[name] || POSES.guard), extraClass);
}

export function fighterThumb(dayIndex) {
  return poseSVG(THUMB_POSES[dayIndex % THUMB_POSES.length], 'thumb');
}

const lerp = (a, b, t) => a + (b - a) * t;
function mix(p, q, t) {
  return {
    lead: [lerp(p.lead[0], q.lead[0], t), lerp(p.lead[1], q.lead[1], t)],
    rear: [lerp(p.rear[0], q.rear[0], t), lerp(p.rear[1], q.rear[1], t)],
    lean: lerp(p.lean, q.lean, t),
    dip: lerp(p.dip, q.dip, t),
    shift: lerp(p.shift, q.shift, t),
  };
}

export function createFighter(container, { size } = {}) {
  container.classList.add('fighter');
  if (size) container.style.width = `${size}px`;
  let current = { ...POSES.guard };
  let from = current;
  let target = POSES.guard;
  let t0 = performance.now();
  let dur = 1;
  let returnAt = null;
  let raf = 0;

  function frame(now) {
    if (returnAt && now >= returnAt) {
      returnAt = null;
      from = current; target = POSES.guard; t0 = now; dur = 260;
    }
    const k = Math.min(1, (now - t0) / dur);
    const ease = 1 - Math.pow(1 - k, 3);
    current = mix(from, target, ease);
    const bounce = Math.sin(now / 260) * 2.2;
    container.innerHTML = svgMarkup(geometry(current, bounce));
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);

  return {
    pose(name) {
      const p = POSES[name] || POSES.guard;
      const now = performance.now();
      from = current; target = p; t0 = now;
      dur = name === 'guard' || name === 'idle' ? 260 : 150;
      returnAt = name === 'guard' || name === 'idle' ? null : now + 420;
    },
    destroy() { cancelAnimationFrame(raf); container.innerHTML = ''; },
  };
}

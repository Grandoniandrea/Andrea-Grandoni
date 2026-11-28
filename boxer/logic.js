// Boxer — pure logic (no DOM). Used by index.html and by the unit tests.

export const PRICES = [
  { id: 'w1', label: 'Piano 1 settimana', price: 6.99, was: null, perDay: 1.0, best: false },
  { id: 'w4', label: 'Piano 4 settimane', price: 15.99, was: 39.99, perDay: 0.57, best: true },
  { id: 'w12', label: 'Piano 12 settimane', price: 29.99, was: 79.99, perDay: 0.36, best: false },
];

export const QUESTIONS = [
  { id: 'sex', type: 'choice', title: 'Per chi è il programma?', options: [
    { v: 'uomo', label: 'Uomo', emoji: '🙋‍♂️' },
    { v: 'donna', label: 'Donna', emoji: '🙋‍♀️' },
  ] },
  { id: 'goal', type: 'choice', title: 'Qual è il tuo obiettivo principale?', options: [
    { v: 'dimagrire', label: 'Perdere peso', emoji: '🔥' },
    { v: 'tonificare', label: 'Tonificare il corpo', emoji: '💪' },
    { v: 'forma', label: 'Mantenermi in forma', emoji: '⚡' },
    { v: 'stress', label: 'Scaricare lo stress', emoji: '🧠' },
  ] },
  { id: 'age', type: 'choice', title: 'Quanti anni hai?', options: [
    { v: '18-29', label: '18–29', emoji: '' },
    { v: '30-39', label: '30–39', emoji: '' },
    { v: '40-49', label: '40–49', emoji: '' },
    { v: '50+', label: '50 e più', emoji: '' },
  ] },
  { id: 'body', type: 'choice', title: 'Come descriveresti il tuo fisico oggi?', options: [
    { v: 'magro', label: 'Magro', emoji: '🪶' },
    { v: 'medio', label: 'Nella media', emoji: '🙂' },
    { v: 'sovrappeso', label: 'Qualche chilo in più', emoji: '🍔' },
    { v: 'pancia', label: 'Pancia da eliminare', emoji: '🎯' },
  ] },
  { id: 'target_body', type: 'choice', title: 'Che fisico vuoi ottenere?', options: [
    { v: 'asciutto', label: 'Asciutto e definito', emoji: '🥊' },
    { v: 'atletico', label: 'Atletico', emoji: '🏃' },
    { v: 'muscoloso', label: 'Più muscoloso', emoji: '🏋️' },
  ] },
  { id: 'info1', type: 'info', title: 'Sei nel posto giusto',
    text: "L'87% delle persone con un obiettivo come il tuo vede i primi risultati entro 4 settimane di shadow boxing." }, // ESEMPIO
  { id: 'experience', type: 'choice', title: 'Hai mai fatto boxe?', options: [
    { v: 'mai', label: 'Mai', emoji: '🆕' },
    { v: 'poco', label: 'Qualche volta', emoji: '👊' },
    { v: 'si', label: 'Sì, mi alleno', emoji: '🥇' },
  ] },
  { id: 'fitness', type: 'choice', title: 'Quanto sei allenato?', options: [
    { v: 'principiante', label: 'Mi stanco presto', emoji: '😮‍💨' },
    { v: 'intermedio', label: 'Mi muovo ogni tanto', emoji: '🚶' },
    { v: 'avanzato', label: 'Mi alleno spesso', emoji: '🏆' },
  ] },
  { id: 'zones', type: 'multi', title: 'Quali zone vuoi migliorare?', options: [
    { v: 'braccia', label: 'Braccia', emoji: '💪' },
    { v: 'pancia', label: 'Pancia', emoji: '🎯' },
    { v: 'spalle', label: 'Spalle e petto', emoji: '🛡️' },
    { v: 'gambe', label: 'Gambe', emoji: '🦵' },
    { v: 'tutto', label: 'Tutto il corpo', emoji: '⚡' },
  ] },
  { id: 'minutes', type: 'choice', title: 'Quanto tempo hai al giorno?', options: [
    { v: '10', label: '10 minuti', emoji: '⏱️' },
    { v: '15', label: '15 minuti', emoji: '⏱️' },
    { v: '20', label: '20 minuti', emoji: '⏱️' },
    { v: '30', label: '30 minuti o più', emoji: '⏱️' },
  ] },
  { id: 'info2', type: 'info', title: 'Niente palestra, niente attrezzi',
    text: 'Ti bastano 2 metri quadrati di salotto. Ti guidiamo colpo per colpo, con la voce del coach.' },
  { id: 'height', type: 'number', title: 'Quanto sei alto?', unit: 'cm', min: 120, max: 230 },
  { id: 'weight', type: 'number', title: 'Quanto pesi oggi?', unit: 'kg', min: 35, max: 250 },
  { id: 'target_weight', type: 'number', title: 'Qual è il tuo peso obiettivo?', unit: 'kg', min: 35, max: 250 },
];

export function validateAnswer(q, value, answers = {}) {
  if (q.type === 'info') return null;
  if (q.type === 'choice') return value ? null : 'Scegli una risposta';
  if (q.type === 'multi') return Array.isArray(value) && value.length ? null : 'Scegli almeno una zona';
  const n = Number(value);
  if (value === '' || value == null || !Number.isFinite(n)) return 'Inserisci un numero';
  if (n < q.min || n > q.max) return `Inserisci un valore tra ${q.min} e ${q.max} ${q.unit}`;
  if (q.id === 'target_weight' && answers.goal === 'dimagrire' && n > Number(answers.weight)) {
    return 'Per perdere peso, l’obiettivo deve essere sotto il peso attuale';
  }
  return null;
}

export function bmi(heightCm, weightKg) {
  const m = heightCm / 100;
  const value = Math.round((weightKg / (m * m)) * 10) / 10;
  const label = value < 18.5 ? 'Sottopeso' : value < 25 ? 'Normale' : value < 30 ? 'Sovrappeso' : 'Obesità';
  return { value, label };
}

const WEEKLY_LOSS = { 10: 0.5, 15: 0.7, 20: 0.8, 30: 0.8 };

export function projection(answers, start) {
  const from = Number(answers.weight);
  const to = Number(answers.target_weight);
  const diff = from - to;
  const rate = WEEKLY_LOSS[answers.minutes] || 0.7;
  const weeks = Math.min(30, Math.max(4, Math.ceil(Math.abs(diff) / rate)));
  const points = [];
  for (let week = 0; week <= weeks; week++) {
    const t = week / weeks;
    const eased = 1 - Math.pow(1 - t, 1.6);
    points.push({ week, kg: Math.round((from - diff * eased) * 10) / 10 });
  }
  points[points.length - 1].kg = to;
  const endDate = new Date(start.getTime() + weeks * 7 * 86400000);
  return { points, endDate, weeks };
}

export const MOVES = {
  1: { name: 'Jab', say: 'jab', pose: 'jab' },
  2: { name: 'Diretto', say: 'diretto', pose: 'cross' },
  3: { name: 'Gancio sinistro', say: 'gancio sinistro', pose: 'hookL' },
  4: { name: 'Gancio destro', say: 'gancio destro', pose: 'hookR' },
  5: { name: 'Montante sinistro', say: 'montante sinistro', pose: 'upperL' },
  6: { name: 'Montante destro', say: 'montante destro', pose: 'upperR' },
  S: { name: 'Schivata', say: 'schiva', pose: 'slip' },
  P: { name: 'Passo indietro', say: 'indietro', pose: 'step' },
};

const POOL_BY_WEEK = [
  ['1', '2'],
  ['1', '2', '3', 'S'],
  ['1', '2', '3', 'S', '4', '5'],
  ['1', '2', '3', 'S', '4', '5', '6', 'P'],
];

const LEVELS = {
  principiante: { rounds: 3, round: 90, rest: 45, every: 5, len: [2, 3] },
  intermedio: { rounds: 4, round: 120, rest: 30, every: 4, len: [2, 4] },
  avanzato: { rounds: 5, round: 150, rest: 30, every: 3, len: [3, 4] },
};

const TITLES = [
  'Le basi: jab e diretto', 'Condizionamento Total Body', 'Guardia e movimento', 'Velocità di braccia',
  'Brucia grassi', 'Resistenza da ring', 'Round di prova',
  'Il gancio', 'Schiva e colpisci', 'Combinazioni base', 'Addominali da pugile',
  'Ritmo e respiro', 'Potenza del diretto', 'Sfida di metà percorso',
  'Il montante', 'Combinazioni a tre colpi', 'Cardio boxe', 'Gambe da pugile',
  'Difesa e contrattacco', 'Esplosività', 'Tre round duri',
  'Combinazioni lunghe', 'Gioco di gambe', 'Brucia grassi avanzato', 'Velocità e precisione',
  'Il round del campione', 'Tutto il repertorio', 'La sfida finale',
];

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function buildWorkout(day, level = 'principiante') {
  const cfg = LEVELS[level] || LEVELS.principiante;
  const week = Math.min(4, Math.ceil(day / 7));
  const pool = POOL_BY_WEEK[week - 1];
  const rounds = cfg.rounds + (week >= 3 ? 1 : 0);
  const rand = rng(day * 7919 + rounds);
  const segs = [{ phase: 'warmup', seconds: 120, label: 'Riscaldamento', combos: [] }];
  for (let r = 1; r <= rounds; r++) {
    const combos = [];
    const count = Math.floor(cfg.round / cfg.every);
    for (let c = 0; c < count; c++) {
      const [lo, hi] = cfg.len;
      const len = lo + Math.floor(rand() * (hi - lo + 1));
      const combo = [];
      for (let k = 0; k < len; k++) combo.push(pool[Math.floor(rand() * pool.length)]);
      combos.push(combo);
    }
    segs.push({ phase: 'round', seconds: cfg.round, label: `Round ${r}`, combos });
    if (r < rounds) segs.push({ phase: 'rest', seconds: cfg.rest, label: 'Pausa', combos: [] });
  }
  segs.push({ phase: 'cooldown', seconds: 90, label: 'Defaticamento', combos: [] });
  return segs;
}

export const PROGRAM = TITLES.map((title, i) => ({
  day: i + 1,
  title,
  minutes: Math.round(buildWorkout(i + 1, 'principiante').reduce((a, s) => a + s.seconds, 0) / 60),
  moves: [...new Set(buildWorkout(i + 1, 'principiante').flatMap((s) => s.combos.flat()))],
}));

export function dayStatus(day, completed) {
  if (completed.includes(day)) return 'done';
  if (day === 1 || completed.includes(day - 1)) return 'open';
  return 'locked';
}

export function createTimer(segments, now) {
  const total = segments.reduce((a, s) => a + s.seconds, 0);
  const start = now();
  let pausedMs = 0;
  let pausedAt = null;
  let skipped = 0;

  const elapsed = () => {
    const t = pausedAt ?? now();
    return (t - start - pausedMs) / 1000 + skipped;
  };

  function locate(e) {
    let acc = 0;
    for (let i = 0; i < segments.length; i++) {
      if (e < acc + segments[i].seconds) return { index: i, segStart: acc };
      acc += segments[i].seconds;
    }
    return { index: segments.length, segStart: total };
  }

  return {
    state() {
      const e = elapsed();
      const { index, segStart } = locate(e);
      if (index >= segments.length) {
        return { index, remaining: 0, phase: 'finished', combo: null, finished: true, paused: pausedAt != null, elapsed: total };
      }
      const seg = segments[index];
      const inSeg = e - segStart;
      const remaining = Math.ceil(seg.seconds - inSeg - 1e-9);
      let combo = null;
      let comboIndex = -1;
      if (seg.combos.length) {
        comboIndex = Math.min(seg.combos.length - 1, Math.floor(inSeg / (seg.seconds / seg.combos.length)));
        combo = seg.combos[comboIndex];
      }
      return { index, remaining, phase: seg.phase, label: seg.label, combo, comboIndex, finished: false, paused: pausedAt != null, elapsed: e };
    },
    pause() { if (pausedAt == null) pausedAt = now(); },
    resume() {
      if (pausedAt != null) { pausedMs += now() - pausedAt; pausedAt = null; }
    },
    skip() {
      const e = elapsed();
      const { index, segStart } = locate(e);
      if (index < segments.length) skipped += segStart + segments[index].seconds - e;
    },
  };
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  PRICES, QUESTIONS, validateAnswer, bmi, projection,
  PROGRAM, MOVES, buildWorkout, dayStatus, createTimer,
} from '../logic.js';

const q = (id) => QUESTIONS.find((x) => x.id === id);

test('bmi computes value and Italian label', () => {
  const r = bmi(180, 81);
  assert.ok(Math.abs(r.value - 25.0) < 0.05);
  assert.equal(r.label, 'Sovrappeso');
  assert.equal(bmi(170, 60).label, 'Normale');
  assert.equal(bmi(170, 50).label, 'Sottopeso');
  assert.equal(bmi(170, 100).label, 'Obesità');
});

test('projection goes from current weight to target, decreasing', () => {
  const start = new Date('2026-12-01');
  const p = projection({ weight: 90, target_weight: 80, minutes: '15' }, start);
  assert.equal(p.points[0].kg, 90);
  assert.equal(p.points.at(-1).kg, 80);
  for (let i = 1; i < p.points.length; i++) assert.ok(p.points[i].kg <= p.points[i - 1].kg);
  assert.ok(p.endDate > start);
  assert.ok(p.weeks >= 4 && p.weeks <= 30);
});

test('projection with no weight loss still lasts at least 4 weeks', () => {
  const p = projection({ weight: 70, target_weight: 70, minutes: '10' }, new Date('2026-12-01'));
  assert.equal(p.weeks, 4);
  assert.equal(p.points.at(-1).kg, 70);
});

test('validateAnswer rejects impossible numbers and accepts sane ones', () => {
  assert.notEqual(validateAnswer(q('height'), 0, {}), null);
  assert.notEqual(validateAnswer(q('height'), '', {}), null);
  assert.equal(validateAnswer(q('height'), 175, {}), null);
  assert.notEqual(validateAnswer(q('weight'), 500, {}), null);
  assert.equal(validateAnswer(q('weight'), 84, {}), null);
});

test('target weight above current is rejected when the goal is losing weight', () => {
  const answers = { goal: 'dimagrire', weight: 90 };
  assert.notEqual(validateAnswer(q('target_weight'), 95, answers), null);
  assert.equal(validateAnswer(q('target_weight'), 80, answers), null);
  assert.equal(validateAnswer(q('target_weight'), 95, { goal: 'muscoli', weight: 90 }), null);
});

test('choice questions require an answer', () => {
  assert.notEqual(validateAnswer(q('goal'), undefined, {}), null);
  assert.equal(validateAnswer(q('goal'), q('goal').options[0].v, {}), null);
});

test('questionnaire has all required questions and info screens', () => {
  for (const id of ['sex', 'goal', 'age', 'body', 'target_body', 'experience', 'fitness', 'zones', 'minutes', 'height', 'weight', 'target_weight']) {
    assert.ok(q(id), `missing ${id}`);
  }
  assert.ok(QUESTIONS.filter((x) => x.type === 'info').length >= 2);
});

test('prices: three plans, 4 weeks is the best', () => {
  assert.deepEqual(PRICES.map((p) => p.id), ['w1', 'w4', 'w12']);
  assert.equal(PRICES.find((p) => p.best).id, 'w4');
  assert.equal(PRICES[1].price, 15.99);
});

test('program has 28 days with titles and minutes', () => {
  assert.equal(PROGRAM.length, 28);
  PROGRAM.forEach((d, i) => {
    assert.equal(d.day, i + 1);
    assert.ok(d.title.length > 0);
    assert.ok(d.minutes > 0);
  });
});

test('workout structure: warmup, alternating rounds and rests, cooldown', () => {
  const w = buildWorkout(1, 'principiante');
  assert.equal(w[0].phase, 'warmup');
  assert.equal(w.at(-1).phase, 'cooldown');
  const mid = w.slice(1, -1);
  mid.forEach((s, i) => assert.equal(s.phase, i % 2 === 0 ? 'round' : 'rest'));
  assert.equal(mid.at(-1).phase, 'round');
});

test('day 1 uses only jab and cross; day 20 includes hooks or uppercuts', () => {
  const moves1 = buildWorkout(1, 'principiante').flatMap((s) => s.combos.flat());
  assert.ok(moves1.length > 0);
  assert.ok(moves1.every((m) => m === '1' || m === '2'));
  const moves20 = buildWorkout(20, 'intermedio').flatMap((s) => s.combos.flat());
  assert.ok(moves20.some((m) => ['3', '4', '5', '6'].includes(m)));
  moves20.forEach((m) => assert.ok(MOVES[m], `unknown move ${m}`));
});

test('advanced rounds are longer than beginner rounds', () => {
  const len = (lvl) => buildWorkout(5, lvl).find((s) => s.phase === 'round').seconds;
  assert.ok(len('avanzato') > len('principiante'));
});

test('dayStatus unlocks days in order', () => {
  assert.equal(dayStatus(1, []), 'open');
  assert.equal(dayStatus(2, []), 'locked');
  assert.equal(dayStatus(2, [1]), 'open');
  assert.equal(dayStatus(1, [1]), 'done');
  assert.equal(dayStatus(3, [1]), 'locked');
});

test('timer counts down from timestamps, pauses and skips', () => {
  let t = 0;
  const segs = [
    { phase: 'warmup', seconds: 10, label: 'Riscaldamento', combos: [] },
    { phase: 'round', seconds: 20, label: 'Round 1', combos: [['1', '2']] },
  ];
  const timer = createTimer(segs, () => t);
  assert.equal(timer.state().remaining, 10);
  t = 5000;
  assert.equal(timer.state().remaining, 5);
  timer.pause();
  t = 9000;
  assert.equal(timer.state().remaining, 5);
  timer.resume();
  t = 11000;
  assert.equal(timer.state().remaining, 3);
  timer.skip();
  assert.equal(timer.state().index, 1);
  assert.equal(timer.state().remaining, 20);
  t = 11000 + 25000;
  assert.equal(timer.state().finished, true);
});

test('timer moves to the next segment when time runs out', () => {
  let t = 0;
  const timer = createTimer([
    { phase: 'warmup', seconds: 2, label: 'a', combos: [] },
    { phase: 'round', seconds: 5, label: 'b', combos: [] },
  ], () => t);
  t = 3000;
  const s = timer.state();
  assert.equal(s.index, 1);
  assert.equal(s.remaining, 4);
  assert.equal(s.phase, 'round');
});

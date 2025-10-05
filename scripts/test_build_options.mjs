import { HINT_MESSAGES } from '../src/data/hints.js';
import { PLACES } from '../src/data/places.js';

function buildOptions(msg) {
  const base = [msg.answer, ...msg.distractors];
  return base
    .map(v => {
      const p = PLACES.find(p => p.id === v);
      return { id: v, label: p?.label || v, emoji: p?.emoji || '❓' };
    })
    .sort(() => Math.random() - 0.5);
}

for (const msg of HINT_MESSAGES) {
  const opts = buildOptions(msg);
  const hasAnswer = opts.some(o => o.id === msg.answer);
  console.log(`id=${msg.id} text="${msg.text}" answer=${msg.answer} -> hasAnswer=${hasAnswer}`);
  console.log(' options:', opts.map(o=>o.id).join(', '));
}

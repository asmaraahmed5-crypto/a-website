/** Tiny Web Audio synth. No audio files, nothing copyrighted. Muted until the visitor turns it on. */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let ambient: { stop: () => void } | null = null;

function ensure() {
  if (ctx) return ctx;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = 0.7;
  master.connect(ctx.destination);
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = 'sine', vol = 0.08, when = 0) {
  if (!enabled) return;
  const c = ensure();
  if (!c || !master) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  click: () => tone(520, 0.12, 'triangle', 0.05),
  chime: () => {
    tone(784, 0.7, 'sine', 0.07);
    tone(1175, 0.9, 'sine', 0.05, 0.09);
  },
  stamp: () => {
    tone(110, 0.25, 'sine', 0.12);
    tone(70, 0.3, 'triangle', 0.1);
  },
  open: () => {
    tone(392, 0.5, 'sine', 0.06);
    tone(523, 0.6, 'sine', 0.06, 0.12);
    tone(659, 0.8, 'sine', 0.05, 0.24);
  },
};

function startAmbient() {
  const c = ensure();
  if (!c || !master || ambient) return;
  const out = c.createGain();
  out.gain.value = 0;
  out.gain.linearRampToValueAtTime(0.05, c.currentTime + 3);
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  out.connect(lp).connect(master);
  const oscs = [146.83, 220, 277.18, 329.63].map((f, i) => {
    const o = c.createOscillator();
    o.type = i % 2 ? 'triangle' : 'sine';
    o.frequency.value = f;
    o.detune.value = (i - 1.5) * 6;
    o.connect(out);
    o.start();
    return o;
  });
  const lfo = c.createOscillator();
  const lfoGain = c.createGain();
  lfo.frequency.value = 0.08;
  lfoGain.gain.value = 300;
  lfo.connect(lfoGain).connect(lp.frequency);
  lfo.start();
  ambient = {
    stop: () => {
      out.gain.cancelScheduledValues(c.currentTime);
      out.gain.setValueAtTime(out.gain.value, c.currentTime);
      out.gain.linearRampToValueAtTime(0, c.currentTime + 1);
      window.setTimeout(() => {
        oscs.forEach((o) => o.stop());
        lfo.stop();
      }, 1100);
    },
  };
}

export function setSound(on: boolean) {
  enabled = on;
  if (on) {
    const c = ensure();
    void c?.resume();
    startAmbient();
    tone(660, 0.3, 'sine', 0.05);
  } else if (ambient) {
    ambient.stop();
    ambient = null;
  }
}

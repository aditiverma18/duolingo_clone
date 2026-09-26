/*
 * Tiny synthesized sound effects using the Web Audio API.
 * No audio files needed. The AudioContext is created lazily on the
 * first user interaction (browsers block audio before that).
 */

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;

  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }

  if (ctx.state === "suspended") {
    void ctx.resume();
  }

  return ctx;
}

function tone(
  freq: number,
  start: number,
  duration: number,
  type: OscillatorType = "sine",
  volume = 0.16,
  slideTo?: number
) {
  const ac = getContext();
  if (!ac) return;

  const t0 = ac.currentTime + start;
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (slideTo) {
    osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + duration);
  }

  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

  osc.connect(gain).connect(ac.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.05);
}

export const sfx = {
  /** Call from any click/keypress so later sounds are allowed to play. */
  unlock() {
    getContext();
  },

  correct() {
    tone(784, 0, 0.14, "sine", 0.18);
    tone(784, 0, 0.14, "triangle", 0.06);
    tone(1175, 0.09, 0.28, "sine", 0.18);
    tone(1175, 0.09, 0.28, "triangle", 0.06);
  },

  wrong() {
    tone(233, 0, 0.16, "square", 0.05, 196);
    tone(175, 0.13, 0.26, "square", 0.05, 147);
  },

  matchCorrect() {
    tone(988, 0, 0.1, "sine", 0.12);
    tone(1319, 0.05, 0.14, "sine", 0.1);
  },

  matchWrong() {
    tone(196, 0, 0.14, "square", 0.04, 165);
  },

  complete() {
    const notes = [523, 659, 784, 1047, 1319];
    notes.forEach((n, i) => {
      tone(n, i * 0.09, 0.3, "triangle", 0.14);
      tone(n, i * 0.09, 0.3, "sine", 0.08);
    });
  },
};

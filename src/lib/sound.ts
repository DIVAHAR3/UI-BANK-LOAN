let ctx: AudioContext | null = null;

function getCtx() {
  if (!ctx) {
    const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new AudioCtor();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

export function playFlatline(durationMs: number) {
  const ac = getCtx();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sine";
  osc.frequency.value = 840;
  gain.gain.value = 0.05;
  osc.connect(gain).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + durationMs / 1000);
  return () => {
    try {
      osc.stop();
    } catch {
      /* already stopped */
    }
  };
}

export function playZap() {
  const ac = getCtx();
  const now = ac.currentTime;
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.exponentialRampToValueAtTime(60, now + 0.25);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
  osc.connect(gain).connect(ac.destination);
  osc.start(now);
  osc.stop(now + 0.26);
}

export function playHeartbeat() {
  const ac = getCtx();
  const now = ac.currentTime;
  [0, 0.18].forEach((offset) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(90, now + offset);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.25, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.15);
    osc.connect(gain).connect(ac.destination);
    osc.start(now + offset);
    osc.stop(now + offset + 0.16);
  });
}

export function playChime() {
  const ac = getCtx();
  const now = ac.currentTime;
  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    const start = now + i * 0.09;
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);
    osc.connect(gain).connect(ac.destination);
    osc.start(start);
    osc.stop(start + 0.36);
  });
}

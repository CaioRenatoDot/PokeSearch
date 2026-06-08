let audioContext;

function getAudioContext() {
  audioContext ||= new AudioContext();
  return audioContext;
}

function tone(frequency, start, duration, type = "square", volume = 0.08) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSearchSound(kind) {
  try {
    const context = getAudioContext();
    const now = context.currentTime;

    if (kind === "success") {
      tone(660, now, 0.09);
      tone(880, now + 0.09, 0.1);
      tone(1320, now + 0.18, 0.12);
      return;
    }

    tone(220, now, 0.12, "sawtooth", 0.07);
    tone(164, now + 0.11, 0.16, "sawtooth", 0.06);
  } catch {
    // Some browsers block audio until the first user gesture. The UI can keep going.
  }
}

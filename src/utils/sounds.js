const SOUND_STORAGE_KEY = "pokesearch:sound";

let audioContext;
let currentCry;
let isSoundOn = readSoundPreference();

function readSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
  } catch {
    // Navegação privada pode bloquear o storage: o som fica ligado só nesta sessão.
    return true;
  }
}

export function isSoundEnabled() {
  return isSoundOn;
}

export function setSoundEnabled(enabled) {
  isSoundOn = enabled;

  if (!enabled) {
    currentCry?.pause();
  }

  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Sem storage a preferência vale só para esta sessão.
  }
}

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
  if (!isSoundOn) return;

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

export function playPokemonCry(cryUrl) {
  if (!isSoundOn) return;

  if (!cryUrl) {
    playSearchSound("success");
    return;
  }

  try {
    currentCry?.pause();

    const cry = new Audio(cryUrl);
    cry.volume = 0.32;
    currentCry = cry;

    // Nem todo navegador toca .ogg e o autoplay pode ser bloqueado: o bipe cobre os dois casos.
    cry.addEventListener("error", () => playSearchSound("success"), { once: true });
    cry.play().catch(() => playSearchSound("success"));
  } catch {
    playSearchSound("success");
  }
}

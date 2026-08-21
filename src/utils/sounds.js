const SOUND_STORAGE_KEY = "pokesearch:sound";
const VOLUME_STORAGE_KEY = "pokesearch:volume";
const DEFAULT_VOLUME = 0.6;

let audioContext;
let currentCry;
let isSoundOn = readSoundPreference();
let masterVolume = readVolumePreference();

function readStoredValue(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Navegação privada pode bloquear o storage: as preferências valem só nesta sessão.
    return null;
  }
}

function writeStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Sem storage a preferência vale só para esta sessão.
  }
}

function clampVolume(value) {
  return Math.min(1, Math.max(0, Number(value) || 0));
}

function readSoundPreference() {
  return readStoredValue(SOUND_STORAGE_KEY) !== "off";
}

function readVolumePreference() {
  const stored = readStoredValue(VOLUME_STORAGE_KEY);
  return stored === null ? DEFAULT_VOLUME : clampVolume(stored);
}

export function isSoundEnabled() {
  return isSoundOn;
}

export function setSoundEnabled(enabled) {
  isSoundOn = enabled;

  if (!enabled) {
    currentCry?.pause();
  }

  writeStoredValue(SOUND_STORAGE_KEY, enabled ? "on" : "off");
}

export function getVolume() {
  return masterVolume;
}

export function setVolume(value) {
  masterVolume = clampVolume(value);

  if (currentCry) {
    currentCry.volume = cryVolume();
  }

  writeStoredValue(VOLUME_STORAGE_KEY, String(masterVolume));
}

function isAudible() {
  return isSoundOn && masterVolume > 0;
}

function cryVolume() {
  return clampVolume(masterVolume * 0.6);
}

function getAudioContext() {
  audioContext ||= new AudioContext();
  return audioContext;
}

function tone(frequency, start, duration, type = "square", volume = 0.08) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const peak = Math.max(0.0002, volume * masterVolume);

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(start);
  oscillator.stop(start + duration + 0.02);
}

export function playSearchSound(kind) {
  if (!isAudible()) return;

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
  if (!isAudible()) return;

  if (!cryUrl) {
    playSearchSound("success");
    return;
  }

  try {
    currentCry?.pause();

    const cry = new Audio(cryUrl);
    cry.volume = cryVolume();
    currentCry = cry;

    // Nem todo navegador toca .ogg e o autoplay pode ser bloqueado: o bipe cobre os dois casos.
    cry.addEventListener("error", () => playSearchSound("success"), { once: true });
    cry.play().catch(() => playSearchSound("success"));
  } catch {
    playSearchSound("success");
  }
}

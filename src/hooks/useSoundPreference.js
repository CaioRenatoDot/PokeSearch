import { useState } from "react";
import { getVolume, isSoundEnabled, setSoundEnabled, setVolume } from "../utils/sounds.js";

export function useSoundPreference() {
  const [isSoundOn, setIsSoundOn] = useState(() => isSoundEnabled());
  const [volume, setVolumeState] = useState(() => getVolume());

  function toggleSound() {
    const next = !isSoundOn;
    setSoundEnabled(next);
    setIsSoundOn(next);
  }

  function changeVolume(nextVolume) {
    setVolume(nextVolume);
    setVolumeState(nextVolume);

    // Arrastar até o zero silencia e sair do zero devolve o som, como num player.
    const shouldBeOn = nextVolume > 0;

    if (shouldBeOn !== isSoundOn) {
      setSoundEnabled(shouldBeOn);
      setIsSoundOn(shouldBeOn);
    }
  }

  return { isSoundOn, toggleSound, volume, changeVolume };
}

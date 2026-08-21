import { useState } from "react";
import { isSoundEnabled, setSoundEnabled } from "../utils/sounds.js";

export function useSoundPreference() {
  const [isSoundOn, setIsSoundOn] = useState(() => isSoundEnabled());

  function toggleSound() {
    setIsSoundOn(current => {
      const next = !current;
      setSoundEnabled(next);
      return next;
    });
  }

  return { isSoundOn, toggleSound };
}

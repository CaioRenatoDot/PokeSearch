import { useEffect, useState } from "react";
import { readStored, writeStored } from "../utils/storage.js";

export function useStoredState(key, initialValue, sanitize = value => value) {
  const [value, setValue] = useState(() => sanitize(readStored(key, initialValue)));

  useEffect(() => {
    writeStored(key, value);
  }, [key, value]);

  return [value, setValue];
}

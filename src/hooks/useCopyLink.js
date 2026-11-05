import { useEffect, useRef, useState } from "react";

const FEEDBACK_MS = 2000;

export function useCopyLink() {
  const [status, setStatus] = useState("idle");
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  async function copy(url) {
    let nextStatus = "copied";

    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // A área de transferência exige HTTPS e permissão; sem ela o aviso manda copiar da barra.
      nextStatus = "failed";
    }

    setStatus(nextStatus);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setStatus("idle"), FEEDBACK_MS);
  }

  return { status, copy };
}

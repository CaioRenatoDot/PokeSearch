import { useEffect, useRef } from "react";

const SEARCH_INPUT_ID = "pokemonInput";

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;

  return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

export function useKeyboardShortcuts(handlers) {
  // Guarda os callbacks numa ref para o listener global ser registrado uma vez só.
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.ctrlKey || event.metaKey || event.altKey) return;

      const isTyping = isTypingTarget(event.target);

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        document.getElementById(SEARCH_INPUT_ID)?.focus();
        return;
      }

      // Dentro do campo de busca as setas pertencem à lista de sugestões.
      if (isTyping) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        handlersRef.current.onPrevious();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handlersRef.current.onNext();
        return;
      }

      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        handlersRef.current.onRandom();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

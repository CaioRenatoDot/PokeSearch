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

      const action = {
        ArrowLeft: handlersRef.current.onPrevious,
        ArrowRight: handlersRef.current.onNext,
        r: handlersRef.current.onRandom,
        f: handlersRef.current.onToggleFavorite
      }[event.key.length === 1 ? event.key.toLowerCase() : event.key];

      if (action) {
        event.preventDefault();
        action();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}

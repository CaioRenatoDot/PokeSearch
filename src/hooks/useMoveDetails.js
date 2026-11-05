import { useEffect, useState } from "react";
import { getMove } from "../api/pokeApi.js";
import { getMoveSummary } from "../utils/moves.js";

export function useMoveDetails(moveName) {
  const [loaded, setLoaded] = useState({ name: null, summary: null, failed: false });

  useEffect(() => {
    let isCurrent = true;

    getMove(moveName)
      .then(data => {
        if (isCurrent) setLoaded({ name: moveName, summary: getMoveSummary(data), failed: false });
      })
      .catch(() => {
        if (isCurrent) setLoaded({ name: moveName, summary: null, failed: true });
      });

    return () => {
      isCurrent = false;
    };
  }, [moveName]);

  return loaded.name === moveName ? loaded : { name: moveName, summary: null, failed: false };
}

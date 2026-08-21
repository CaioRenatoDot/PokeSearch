import { useEffect, useState } from "react";
import { getType } from "../api/pokeApi.js";
import { buildDamageMultipliers, groupMultipliers } from "../utils/typeEffectiveness.js";

const EMPTY_GROUPS = [];

export function useTypeEffectiveness(types) {
  const [loaded, setLoaded] = useState({ key: null, groups: EMPTY_GROUPS });
  const typeKey = types.join(",");

  useEffect(() => {
    if (!typeKey) return;

    let isCurrent = true;

    Promise.all(typeKey.split(",").map(getType))
      .then(resources => {
        if (isCurrent) setLoaded({ key: typeKey, groups: groupMultipliers(buildDamageMultipliers(resources)) });
      })
      .catch(() => {
        if (isCurrent) setLoaded({ key: typeKey, groups: EMPTY_GROUPS });
      });

    return () => {
      isCurrent = false;
    };
  }, [typeKey]);

  return loaded.key === typeKey ? loaded.groups : EMPTY_GROUPS;
}

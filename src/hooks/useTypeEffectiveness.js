import { useEffect, useState } from "react";
import { getType } from "../api/pokeApi.js";
import { buildDamageMultipliers, groupMultipliers } from "../utils/typeEffectiveness.js";

export function useTypeEffectiveness(types) {
  const [groups, setGroups] = useState([]);
  const typeKey = types.join(",");

  useEffect(() => {
    if (!typeKey) {
      setGroups([]);
      return;
    }

    let isCurrent = true;

    Promise.all(typeKey.split(",").map(getType))
      .then(resources => {
        if (isCurrent) setGroups(groupMultipliers(buildDamageMultipliers(resources)));
      })
      .catch(() => {
        if (isCurrent) setGroups([]);
      });

    return () => {
      isCurrent = false;
    };
  }, [typeKey]);

  return groups;
}

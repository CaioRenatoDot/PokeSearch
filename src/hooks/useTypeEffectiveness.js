import { useMemo } from "react";
import { buildDamageMultipliers, getStrongAgainst, groupMultipliers } from "../utils/typeEffectiveness.js";
import { useTypeResources } from "./useTypeResources.js";

const NO_GROUPS = [];
const NO_TYPES = [];

export function useTypeEffectiveness(types) {
  const { index, isLoading, failed } = useTypeResources(types);

  const { groups, strongAgainst } = useMemo(() => {
    if (!index) return { groups: NO_GROUPS, strongAgainst: NO_TYPES };

    const resources = Object.values(index);

    return {
      groups: groupMultipliers(buildDamageMultipliers(resources)),
      strongAgainst: getStrongAgainst(resources)
    };
  }, [index]);

  return { groups, strongAgainst, isLoading, failed };
}

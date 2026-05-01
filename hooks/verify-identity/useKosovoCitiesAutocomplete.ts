import { KosovoCity } from "@/types/app-types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useKosovoCitiesAutocomplete() {
  const allCities = useMemo(() => Object.values(KosovoCity) as string[], []);
  const [citiesShown, setCitiesShown] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    setCitiesShown(allCities);
  }, [allCities]);

  const filter = useCallback((input: string) => {
    if (!input) {
      setCitiesShown(allCities);
      return;
    }

    const q = input.toLowerCase();
    setCitiesShown(allCities.filter((c) => c.toLowerCase().includes(q)));
  }, [allCities]);

  return {
    citiesShown,
    showDropdown,
    setShowDropdown,
    filter,
  };
}


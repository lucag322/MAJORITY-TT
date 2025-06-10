"use client";

import { useState, useCallback, useMemo } from "react";
import { Country } from "../types/country";

export interface UseCountryComparisonReturn {
  comparedCountries: Country[];
  isComparisonOpen: boolean;
  addToComparison: (country: Country) => void;
  removeFromComparison: (countryCode: string) => void;
  clearComparison: () => void;
  toggleComparison: () => void;
  toggleCountryInComparison: (
    country: Country
  ) => "added" | "removed" | "max_reached";
  isCountryInComparison: (countryCode: string) => boolean;
  canAddMore: boolean;
}

const MAX_COMPARED_COUNTRIES = 4; // Maximum 4 pays pour une bonne lisibilité

export function useCountryComparison(): UseCountryComparisonReturn {
  const [comparedCountries, setComparedCountries] = useState<Country[]>([]);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);

  // Ajouter un pays à la comparaison
  const addToComparison = useCallback(
    (country: Country) => {
      setComparedCountries((prev) => {
        // Éviter les doublons
        if (prev.some((c) => c.cca2 === country.cca2)) {
          return prev;
        }

        // Limiter le nombre de pays
        if (prev.length >= MAX_COMPARED_COUNTRIES) {
          return prev;
        }

        const newList = [...prev, country];

        // Ne plus ouvrir automatiquement la comparaison
        // L'utilisateur devra cliquer sur le bouton de comparaison pour l'ouvrir

        return newList;
      });
    },
    [isComparisonOpen]
  );

  // Retirer un pays de la comparaison
  const removeFromComparison = useCallback((countryCode: string) => {
    setComparedCountries((prev) => {
      const newList = prev.filter((c) => c.cca2 !== countryCode);

      // Fermer automatiquement si moins de 2 pays
      if (newList.length < 2) {
        setIsComparisonOpen(false);
      }

      return newList;
    });
  }, []);

  // Vider la comparaison
  const clearComparison = useCallback(() => {
    setComparedCountries([]);
    setIsComparisonOpen(false);
  }, []);

  // Basculer l'affichage de la comparaison
  const toggleComparison = useCallback(() => {
    setIsComparisonOpen((prev) => !prev);
  }, []);

  // Vérifier si un pays est dans la comparaison
  const isCountryInComparison = useCallback(
    (countryCode: string) => {
      return comparedCountries.some((c) => c.cca2 === countryCode);
    },
    [comparedCountries]
  );

  // Peut-on ajouter plus de pays ?
  const canAddMore = useMemo(() => {
    return comparedCountries.length < MAX_COMPARED_COUNTRIES;
  }, [comparedCountries.length]);

  // Fonction toggle pour ajouter/retirer un pays
  const toggleCountryInComparison = useCallback(
    (country: Country) => {
      if (isCountryInComparison(country.cca2)) {
        removeFromComparison(country.cca2);
        return "removed";
      } else if (canAddMore) {
        addToComparison(country);
        return "added";
      }
      return "max_reached";
    },
    [isCountryInComparison, removeFromComparison, canAddMore, addToComparison]
  );

  return {
    comparedCountries,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    toggleCountryInComparison,
    isCountryInComparison,
    canAddMore,
  };
}

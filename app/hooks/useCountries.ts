"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Country, CountryPosition } from "../types/country";
import { countryService } from "../services/countryService";
import { useResponsive } from "./useResponsive";
import {
  useCountryComparison,
  UseCountryComparisonReturn,
} from "./useCountryComparison";

export interface UseCountriesReturn extends UseCountryComparisonReturn {
  countries: CountryPosition[];
  loading: boolean;
  error: string | null;
  selectedCountry: Country | null;
  isModalOpen: boolean;
  selectCountry: (country: Country | null) => void;
  closeModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCountries: CountryPosition[];
  focusedCountry: CountryPosition | null;
  focusOnCountry: (country: CountryPosition | null) => void;
  searchResults: CountryPosition[]; // Tous les résultats de recherche
}

export function useCountries(): UseCountriesReturn {
  const [allCountries, setAllCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [focusedCountry, setFocusedCountry] = useState<CountryPosition | null>(
    null
  );

  // Hook pour la responsivité
  const { isMobile } = useResponsive();

  // Intégrer la logique de comparaison
  const comparison = useCountryComparison();

  // Charger tous les pays au démarrage
  useEffect(() => {
    const loadCountries = async () => {
      try {
        setLoading(true);
        setError(null);

        const countriesData = await countryService.getAllCountries();

        // Filtrer les pays avec drapeaux valides
        const validCountries = countriesData.filter(
          (country) =>
            country.flags?.png &&
            country.name?.common &&
            country.latlng?.length === 2
        ); // Afficher tous les pays disponibles

        setAllCountries(validCountries);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load countries"
        );
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  // Générer les positions 3D des pays - optimisé pour éviter la randomisation à chaque render
  const countries = useMemo((): CountryPosition[] => {
    if (allCountries.length === 0) return [];

    // Radius plus grand sur mobile pour espacer les drapeaux
    const sphereRadius = isMobile ? 15 : 12;

    const positions = countryService.generateSpherePositions(
      allCountries.length,
      sphereRadius
    );

    // Utiliser un seed consistant basé sur le nom du pays pour des rotations reproductibles
    return allCountries.map((country, index) => {
      const seed = country.name.common.charCodeAt(0) + index;
      return {
        country,
        position: positions[index],
        rotation: [
          (seed * 1.618) % (Math.PI * 2), // Utiliser le nombre d'or pour une distribution
          (seed * 2.718) % (Math.PI * 2), // Utiliser le nombre e
          (seed * 3.14159) % (Math.PI * 2), // Utiliser pi
        ] as [number, number, number],
      };
    });
  }, [allCountries, isMobile]);

  // Filtrer les pays selon la recherche
  const filteredCountries = useMemo((): CountryPosition[] => {
    if (!searchQuery.trim()) return countries;

    const query = searchQuery.toLowerCase();
    return countries.filter(
      ({ country }) =>
        country.name.common.toLowerCase().includes(query) ||
        country.name.official.toLowerCase().includes(query) ||
        country.region.toLowerCase().includes(query) ||
        country.capital?.some((cap) => cap.toLowerCase().includes(query))
    );
  }, [countries, searchQuery]);

  // Fonctions pour gérer la sélection de pays - mémorisées pour éviter les re-renders
  const selectCountry = useCallback((country: Country | null) => {
    setSelectedCountry(country);
    setIsModalOpen(!!country);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  }, []);

  // Fonction pour faire le focus sur un pays (rotation automatique)
  const focusOnCountry = useCallback((country: CountryPosition | null) => {
    setFocusedCountry(country);
  }, []);

  // Auto-focus sur le premier résultat de recherche
  useEffect(() => {
    if (searchQuery.trim() && filteredCountries.length > 0) {
      // Si la recherche retourne un seul résultat exact, focus dessus
      const exactMatch = filteredCountries.find(
        ({ country }) =>
          country.name.common.toLowerCase() === searchQuery.toLowerCase() ||
          country.name.official.toLowerCase() === searchQuery.toLowerCase()
      );

      if (exactMatch) {
        focusOnCountry(exactMatch);
      } else if (filteredCountries.length === 1) {
        // Si un seul résultat, focus dessus
        focusOnCountry(filteredCountries[0]);
      } else {
        // Sinon, focus sur le premier résultat
        focusOnCountry(filteredCountries[0]);
      }
    } else {
      // Pas de recherche, pas de focus
      focusOnCountry(null);
    }
  }, [filteredCountries, searchQuery, focusOnCountry]);

  return {
    countries: filteredCountries,
    loading,
    error,
    selectedCountry,
    isModalOpen,
    selectCountry,
    closeModal,
    searchQuery,
    setSearchQuery,
    filteredCountries,
    focusedCountry,
    focusOnCountry,
    searchResults: filteredCountries,
    // Fonctionnalités de comparaison
    ...comparison,
  };
}

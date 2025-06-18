"use client";

import { useState, useEffect } from "react";

// Breakpoints Tailwind CSS par défaut
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

type Breakpoint = keyof typeof breakpoints;

interface UseResponsiveReturn {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
}

export function useResponsive(): UseResponsiveReturn {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Initialiser avec la taille actuelle
    handleResize();

    // Ajouter l'écouteur d'événements
    window.addEventListener("resize", handleResize);

    // Nettoyer l'écouteur
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isAbove = (breakpoint: Breakpoint) =>
    windowSize.width >= breakpoints[breakpoint];

  const isBelow = (breakpoint: Breakpoint) =>
    windowSize.width < breakpoints[breakpoint];

  const isBetween = (min: Breakpoint, max: Breakpoint) =>
    windowSize.width >= breakpoints[min] && windowSize.width < breakpoints[max];

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < breakpoints.md,
    isTablet:
      windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    isAbove,
    isBelow,
    isBetween,
  };
}

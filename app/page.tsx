"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useCountries } from "./hooks/useCountries";
import { useResponsive } from "./hooks/useResponsive";
import LoadingSpinner from "./components/LoadingSpinner";
import SearchBar from "./components/SearchBar";
import CountryDetailPanel from "./components/CountryDetailPanel";
import CountryComparison from "./components/CountryComparison";
import ComparisonButton from "./components/ComparisonButton";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Country } from "./types/country";
import React from "react";

// Charger le composant Globe3D dynamiquement pour éviter les problèmes SSR
const Globe3D = dynamic(() => import("./components/Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full">
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  ),
});

function ErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="text-6xl mb-4">🌍</div>
            <CardTitle className="text-2xl font-bold mb-4">
              Loading Error
            </CardTitle>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={onRetry} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const {
    countries,
    loading,
    error,
    selectedCountry,
    isModalOpen,
    selectCountry,
    closeModal,
    searchQuery,
    setSearchQuery,
    focusedCountry,
    searchResults,
    // Fonctionnalités de comparaison
    comparedCountries,
    isComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    toggleCountryInComparison,
    isCountryInComparison,
    canAddMore,
  } = useCountries();

  // Hook pour gérer la responsivité
  const { isMobile, isDesktop } = useResponsive();

  // Fonction pour gérer les actions de comparaison depuis le globe
  const handleComparisonAction = (country: Country) => {
    toggleCountryInComparison(country);
  };

  // Gestion des erreurs
  if (error) {
    return (
      <ErrorState error={error} onRetry={() => window.location.reload()} />
    );
  }

  // État de chargement
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main
      className={`relative w-full h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 ${
        isMobile ? "p-0 m-0" : ""
      }`}
    >
      {/* Fond animé avec des particules */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              repeatType: "reverse",
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Globe container - Animation only on desktop */}
      {isMobile ? (
        <div className="relative w-full h-full">
          {/* Globe 3D - plein écran sur mobile */}
          <motion.div
            className="w-full h-full absolute inset-0 mobile-full-width"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Globe3D
                countries={countries}
                onCountryClick={selectCountry}
                onComparisonAction={handleComparisonAction}
                isCountryInComparison={isCountryInComparison}
                className="w-full h-full mobile-full-width"
                focusedCountry={focusedCountry}
                searchResults={searchResults}
                isMobile={isMobile}
              />
            </Suspense>
          </motion.div>

          {/* UI Elements - Mobile only, fixed position */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Barre de recherche */}
            <div className="pointer-events-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultsCount={countries.length}
              />
            </div>

            {/* Instructions d'utilisation - mobile */}
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-ui-overlay px-2 w-full max-w-xs pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-center text-muted-foreground bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/50 text-xs">
                🌍 Tap near flags • Pinch to zoom closer • Drag to rotate
              </p>
            </motion.div>

            {/* Bouton de comparaison - mobile */}
            <motion.div
              className="absolute bottom-16 right-3 z-floating-buttons pointer-events-auto"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ComparisonButton
                countries={comparedCountries}
                onClick={toggleComparison}
                onClear={clearComparison}
                canAddMore={canAddMore}
                className="shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      ) : (
        <motion.div
          className="relative w-full h-full"
          animate={{
            x: isModalOpen ? (isDesktop ? "-25%" : "-30%") : "0%",
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
        >
          {/* Globe 3D - desktop */}
          <motion.div
            className="w-full h-full absolute inset-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Suspense fallback={<LoadingSpinner />}>
              <Globe3D
                countries={countries}
                onCountryClick={selectCountry}
                onComparisonAction={handleComparisonAction}
                isCountryInComparison={isCountryInComparison}
                className="w-full h-full"
                focusedCountry={focusedCountry}
                searchResults={searchResults}
                isMobile={isMobile}
              />
            </Suspense>
          </motion.div>

          {/* UI Elements - Desktop, moves with globe animation */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Titre principal */}
            <motion.div
              className="absolute z-ui-base top-4 left-4 sm:top-4 sm:left-4 lg:top-6 lg:left-6 pointer-events-auto"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="font-bold text-gray-800 dark:text-white text-lg sm:text-2xl lg:text-3xl">
                🌍 Globe Explorer
              </h1>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-gray-300 mt-1">
                Discover countries around the world
              </p>
            </motion.div>

            {/* Statistiques */}
            <motion.div
              className="absolute top-2 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 z-ui-base pointer-events-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg lg:rounded-2xl p-3 lg:p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
                <div className="text-center">
                  <div className="text-xl lg:text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {countries.length}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300">
                    countries
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Barre de recherche */}
            <div className="pointer-events-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                resultsCount={countries.length}
              />
            </div>

            {/* Instructions d'utilisation - desktop */}
            <motion.div
              className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-ui-overlay px-2 w-full max-w-md pointer-events-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
            >
              <p className="text-center text-muted-foreground bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-200/50 dark:border-gray-700/50 text-xs sm:text-sm">
                🌍 Click flags • Cmd+Click to compare • Scroll to zoom • Drag to
                rotate
              </p>
            </motion.div>

            {/* Bouton de comparaison */}
            <motion.div
              className="absolute bottom-20 right-4 lg:bottom-6 lg:right-6 z-floating-buttons pointer-events-auto"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <ComparisonButton
                countries={comparedCountries}
                onClick={toggleComparison}
                onClear={clearComparison}
                canAddMore={canAddMore}
                className="shadow-lg"
              />
            </motion.div>

            {/* Signature */}
            <motion.div
              className="absolute bottom-6 right-6 z-ui-overlay hidden lg:block pointer-events-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg px-2 py-1">
                Developed by Luca • MAJORITY Technical Test
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Panneau latéral avec les détails du pays - Position absolue fixe */}
      <CountryDetailPanel
        country={selectedCountry}
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToComparison={addToComparison}
        onOpenComparison={toggleComparison}
        isInComparison={
          selectedCountry ? isCountryInComparison(selectedCountry.cca2) : false
        }
        canAddMore={canAddMore}
        comparisonCount={comparedCountries.length}
      />

      {/* Modal de comparaison - Position absolue fixe */}
      <CountryComparison
        countries={comparedCountries}
        isOpen={isComparisonOpen}
        onClose={toggleComparison}
        onRemoveCountry={removeFromComparison}
        onClear={clearComparison}
      />
    </main>
  );
}

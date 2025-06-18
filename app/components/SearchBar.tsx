"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useResponsive } from "../hooks/useResponsive";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultsCount: number;
}

export default function SearchBar({
  value,
  onChange,
  resultsCount,
}: SearchBarProps) {
  const { isMobile } = useResponsive();

  // Version mobile avec barre fixe en haut
  if (isMobile) {
    return (
      <motion.div
        className="fixed top-3 left-1/2 transform -translate-x-1/2 z-search-bar w-[90%] max-w-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        data-search-bar
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search countries..."
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 h-10 rounded-lg focus:ring-2 focus:ring-blue-500"
              style={{ fontSize: "16px" }}
              enterKeyHint="search"
              inputMode="search"
            />
            {value && (
              <button
                onClick={() => onChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {value && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2 flex items-center justify-between"
            >
              <span className="text-xs text-gray-600 dark:text-gray-400">
                Found {resultsCount} countries
              </span>
              {resultsCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs"
                >
                  {resultsCount}
                </Badge>
              )}
            </motion.div>
          )}
        </div>
      </motion.div>
    );
  }

  // Version desktop originale
  return (
    <motion.div
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-search-bar w-auto max-w-md lg:max-w-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      data-search-bar
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 p-3 lg:p-4 mx-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search countries..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 pr-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm sm:text-base h-10 sm:h-auto rounded-lg"
          />
          {value && (
            <button
              onClick={() => onChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex items-center justify-between"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Results:
            </span>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs"
            >
              {resultsCount}
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Instructions - desktop only */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-3 text-center"
      >
        <p className="text-sm text-muted-foreground bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-2 inline-block border border-gray-200/50 dark:border-gray-700/50">
          🌍 Click on a flag to explore the country
        </p>
      </motion.div>
    </motion.div>
  );
}

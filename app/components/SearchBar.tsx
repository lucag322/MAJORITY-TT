"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

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
  return (
    <motion.div
      className="fixed top-6 left-1/2 transform -translate-x-1/2 z-40 w-96"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search countries..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>

        {value && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mt-3 flex items-center justify-between"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Search results:
            </span>
            <Badge
              variant="secondary"
              className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
              {resultsCount} countries
            </Badge>
          </motion.div>
        )}
      </div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-4 text-center"
      >
        <p className="text-sm text-muted-foreground bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg px-3 py-2 inline-block border border-gray-200/50 dark:border-gray-700/50">
          🌍 Click on a flag to explore the country
        </p>
      </motion.div>
    </motion.div>
  );
}

"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X } from "lucide-react";
import Image from "next/image";
import { Country } from "../types/country";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useResponsive } from "../hooks/useResponsive";

interface ComparisonButtonProps {
  countries: Country[];
  onClick: () => void;
  onClear: () => void;
  canAddMore: boolean;
  className?: string;
}

export default function ComparisonButton({
  countries,
  onClick,
  onClear,
  canAddMore,
  className = "",
}: ComparisonButtonProps) {
  const { isMobile } = useResponsive();

  if (countries.length === 0) return null;

  // Version mobile compacte
  if (isMobile) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className={`fixed bottom-4 right-4 z-floating-buttons ${className}`}
        >
          {/* Bouton principal compact */}
          <Button
            onClick={onClick}
            disabled={countries.length < 2}
            className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg relative"
          >
            <Scale className="w-5 h-5" />
            {countries.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center">
                {countries.length}
              </Badge>
            )}
          </Button>
        </motion.div>
      </AnimatePresence>
    );
  }

  // Version desktop complète
  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className={`fixed bottom-6 right-4 lg:right-6 z-floating-buttons ${className}`}
      >
        <Card className="w-72 sm:w-80 shadow-lg border">
          {/* Header */}
          <CardHeader className="border-b p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium text-xs sm:text-sm">
                  Compare ({countries.length}/4)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="h-6 w-6 sm:h-8 sm:w-8 p-0"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Country previews */}
          <CardContent className="p-3 sm:p-4">
            <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4 justify-center">
              {countries.slice(0, 4).map((country) => (
                <div key={country.cca2} className="flex flex-col items-center">
                  <Image
                    src={country.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    width={32}
                    height={24}
                    className="rounded border shadow-sm sm:w-10 sm:h-[30px]"
                    style={{ width: "auto", height: "24px" }}
                  />
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {country.cca2}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2 sm:space-y-3">
              <Button
                onClick={onClick}
                disabled={countries.length < 2}
                className="w-full text-xs sm:text-sm"
                size="sm"
              >
                {countries.length < 2
                  ? "Add another country"
                  : "Compare Countries"}
              </Button>

              {!canAddMore && (
                <Badge
                  variant="outline"
                  className="w-full justify-center text-amber-600 text-xs"
                >
                  Maximum 4 countries reached
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}

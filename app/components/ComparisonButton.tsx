"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X } from "lucide-react";
import Image from "next/image";
import { Country } from "../types/country";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ComparisonButtonProps {
  countries: Country[];
  onClick: () => void;
  onClear: () => void;
  canAddMore: boolean;
}

export default function ComparisonButton({
  countries,
  onClick,
  onClear,
  canAddMore,
}: ComparisonButtonProps) {
  if (countries.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        className="fixed bottom-6 right-6 z-40"
      >
        <Card className="w-80 shadow-lg border">
          {/* Header */}
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5" />
                <span className="font-medium text-sm">
                  Compare ({countries.length}/4)
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onClear}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Country previews */}
          <CardContent className="p-4">
            <div className="flex gap-3 mb-4 justify-center">
              {countries.slice(0, 4).map((country) => (
                <div key={country.cca2} className="flex flex-col items-center">
                  <Image
                    src={country.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    width={40}
                    height={30}
                    className="rounded border shadow-sm"
                    style={{ width: "auto", height: "30px" }}
                  />
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {country.cca2}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onClick={onClick}
                disabled={countries.length < 2}
                className="w-full"
                size="sm"
              >
                {countries.length < 2
                  ? "Add another country"
                  : "Compare Countries"}
              </Button>

              {!canAddMore && (
                <Badge
                  variant="outline"
                  className="w-full justify-center text-amber-600"
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

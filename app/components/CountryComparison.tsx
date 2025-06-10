"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Country } from "../types/country";
import { COMPARISON_CATEGORIES, CountryMetric } from "../types/comparison";
import { X, Scale } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CountryComparisonProps {
  countries: Country[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveCountry: (countryCode: string) => void;
  onClear: () => void;
}

// Formater une valeur selon son type
function formatValue(
  value: string | number | string[],
  format: CountryMetric["format"]
): string {
  switch (format) {
    case "number":
      if (typeof value === "number") {
        return value.toLocaleString();
      }
      return String(value);

    case "list":
      if (Array.isArray(value)) {
        return value.join(", ");
      }
      return String(value);

    case "text":
    default:
      return String(value);
  }
}

export default function CountryComparison({
  countries,
  isOpen,
  onClose,
  onRemoveCountry,
  onClear,
}: CountryComparisonProps) {
  if (!isOpen || countries.length === 0) return null;

  // Calculer la largeur dynamique basée sur le nombre de pays
  const getModalWidth = () => {
    if (typeof window === "undefined") return "95vw";
    const baseWidth = 600; // Largeur minimale
    const countryWidth = 180; // Largeur par pays
    const maxWidth = Math.min(
      window.innerWidth - 40,
      baseWidth + countries.length * countryWidth
    );
    return `${maxWidth}px`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="h-[90vh] flex flex-col"
        style={{ maxWidth: getModalWidth(), width: "95vw" }}
        showCloseButton={false}
      >
        <DialogHeader className="border-b pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scale className="w-8 h-8" />
              <div>
                <DialogTitle className="text-2xl font-bold">
                  Country Comparison
                </DialogTitle>
                <p className="text-muted-foreground">
                  Comparing {countries.length} countries side by side
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={onClear} variant="outline" size="sm">
                Clear All
              </Button>
              <Button onClick={onClose} variant="outline" size="sm">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6">
          {/* Countries Headers */}
          <div className="flex gap-4 mb-6 justify-center overflow-x-auto">
            {countries.map((country) => (
              <motion.div
                key={country.cca2}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative group flex-shrink-0"
              >
                <Card className="text-center w-44 min-h-[140px]">
                  <CardContent className="p-4">
                    <Button
                      onClick={() => onRemoveCountry(country.cca2)}
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </Button>

                    <Image
                      src={country.flags.svg}
                      alt={`Flag of ${country.name.common}`}
                      width={60}
                      height={40}
                      className="mx-auto mb-3 rounded shadow-md border"
                      style={{ width: "auto", height: "40px" }}
                    />
                    <h3
                      className="font-bold text-sm leading-tight overflow-hidden text-ellipsis"
                      title={country.name.common}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.2em",
                        height: "2.4em",
                      }}
                    >
                      {country.name.common}
                    </h3>
                    <Badge variant="outline" className="mt-1">
                      {country.cca2}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className="space-y-6">
            {COMPARISON_CATEGORIES.map((category) => (
              <Card key={category.name}>
                <CardHeader>
                  <CardTitle className="text-xl">{category.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Metric</TableHead>
                        {countries.map((country) => (
                          <TableHead key={country.cca2} className="text-center">
                            {country.name.common}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {category.metrics.map((metric) => (
                        <TableRow key={metric.label}>
                          <TableCell className="font-medium">
                            {metric.label}
                          </TableCell>
                          {countries.map((country) => {
                            const value = metric.getValue(country);
                            const formattedValue = formatValue(
                              value,
                              metric.format
                            );

                            return (
                              <TableCell
                                key={country.cca2}
                                className="text-center"
                              >
                                {metric.format === "list" &&
                                Array.isArray(value) ? (
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {value.map((item, index) => (
                                      <Badge
                                        key={index}
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {item}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span>{formattedValue}</span>
                                )}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { useResponsive } from "../hooks/useResponsive";

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
  const { isMobile } = useResponsive();

  if (!isOpen || countries.length === 0) return null;

  // Calculer la largeur dynamique basée sur le nombre de pays
  const getModalWidth = () => {
    if (isMobile) return "100vw";
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
        className={`${
          isMobile
            ? "h-screen w-screen max-w-none m-0 rounded-none z-modals"
            : "h-[90vh] z-modals"
        } flex flex-col`}
        style={!isMobile ? { maxWidth: getModalWidth(), width: "95vw" } : {}}
        showCloseButton={false}
      >
        <DialogHeader className={`border-b ${isMobile ? "px-0 py-2" : "pb-4"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className={`${isMobile ? "w-5 h-5" : "w-8 h-8"}`} />
              <div>
                <DialogTitle
                  className={`${isMobile ? "text-base" : "text-2xl"} font-bold`}
                >
                  {isMobile ? "Comparison" : "Country Comparison"}
                </DialogTitle>
                <p
                  className={`text-muted-foreground ${
                    isMobile ? "text-xs" : "text-sm"
                  }`}
                >
                  {isMobile
                    ? `${countries.length} countries`
                    : `Comparing ${countries.length} countries`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                onClick={onClear}
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className={isMobile ? "px-2 py-1 text-xs h-7" : ""}
              >
                {isMobile ? "Clear" : "Clear All"}
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size={isMobile ? "sm" : "sm"}
                className={isMobile ? "px-2 py-1 h-7 w-7" : ""}
              >
                <X className={`${isMobile ? "w-3 h-3" : "w-5 h-5"}`} />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div
          className={`flex-1 overflow-auto ${isMobile ? "px-0 py-0" : "p-6"}`}
        >
          {/* Countries Headers */}
          <div
            className={`flex ${
              isMobile ? "gap-1 mb-3" : "gap-4 mb-6"
            } justify-center overflow-x-auto`}
          >
            {countries.map((country) => (
              <motion.div
                key={country.cca2}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative group flex-shrink-0"
              >
                <Card
                  className={`text-center ${
                    isMobile ? "w-28 min-h-[85px]" : "w-44 min-h-[140px]"
                  }`}
                >
                  <CardContent className={isMobile ? "px-1 py-2 pt-0" : ""}>
                    <Button
                      onClick={() => onRemoveCountry(country.cca2)}
                      variant="destructive"
                      size="sm"
                      className={`absolute ${
                        isMobile
                          ? "top-0.5 right-0.5 h-4 w-4"
                          : "top-2 right-2 h-6 w-6"
                      } p-0 opacity-0 group-hover:opacity-100 transition-opacity`}
                    >
                      <X className={`${isMobile ? "w-2 h-2" : "w-3 h-3"}`} />
                    </Button>

                    <Image
                      src={country.flags.svg}
                      alt={`Flag of ${country.name.common}`}
                      width={isMobile ? 32 : 60}
                      height={isMobile ? 24 : 40}
                      className={`mx-auto ${
                        isMobile ? "mb-1" : "mb-3"
                      } rounded shadow-md border`}
                      style={{
                        width: "auto",
                        height: isMobile ? "24px" : "40px",
                      }}
                    />
                    <h3
                      className={`font-bold ${
                        isMobile ? "text-xs" : "text-sm"
                      } leading-tight overflow-hidden text-ellipsis`}
                      title={country.name.common}
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.1em",
                        height: isMobile ? "2.2em" : "2.4em",
                      }}
                    >
                      {country.name.common}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`mt-0.5 ${
                        isMobile ? "text-xs px-1 py-0" : ""
                      }`}
                    >
                      {country.cca2}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Comparison Table */}
          <div className={`space-y-${isMobile ? "2" : "6"}`}>
            {COMPARISON_CATEGORIES.map((category) => (
              <Card key={category.name}>
                <CardHeader className={isMobile ? "p-2 pb-1" : ""}>
                  <CardTitle className={`${isMobile ? "text-sm" : "text-xl"}`}>
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className={isMobile ? "px-1 py-2 pt-0" : ""}>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead
                            className={`${
                              isMobile ? "w-[100px] text-xs p-1" : "w-[200px]"
                            }`}
                          >
                            Metric
                          </TableHead>
                          {countries.map((country) => (
                            <TableHead
                              key={country.cca2}
                              className={`text-center ${
                                isMobile ? "text-xs p-1" : ""
                              }`}
                            >
                              {isMobile ? country.cca2 : country.name.common}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {category.metrics.map((metric) => (
                          <TableRow key={metric.label}>
                            <TableCell
                              className={`font-medium ${
                                isMobile ? "text-xs p-1" : ""
                              }`}
                            >
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
                                  className={`text-center ${
                                    isMobile ? "text-xs p-1" : ""
                                  }`}
                                >
                                  {metric.format === "list" &&
                                  Array.isArray(value) ? (
                                    <div className="flex flex-wrap gap-1 justify-center">
                                      {value.map((item, index) => (
                                        <Badge
                                          key={index}
                                          variant="secondary"
                                          className={
                                            isMobile
                                              ? "text-xs px-1 py-0"
                                              : "text-xs"
                                          }
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

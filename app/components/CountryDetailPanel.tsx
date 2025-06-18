"use client";

import React from "react";
import Image from "next/image";
import { Country } from "../types/country";
import {
  Check,
  Scale,
  MapPin,
  Globe,
  Users,
  Coins,
  Clock,
  ExternalLink,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useResponsive } from "../hooks/useResponsive";

interface CountryDetailPanelProps {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToComparison?: (country: Country) => void;
  onOpenComparison?: () => void;
  isInComparison?: boolean;
  canAddMore?: boolean;
  comparisonCount?: number;
}

export default function CountryDetailPanel({
  country,
  isOpen,
  onClose,
  onAddToComparison,
  onOpenComparison,
  isInComparison = false,
  canAddMore = true,
  comparisonCount = 0,
}: CountryDetailPanelProps) {
  const { isMobile } = useResponsive();

  if (!country) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose} modal={false}>
      <SheetContent
        side={isMobile ? "bottom" : "right"}
        className={`
          ${
            isMobile
              ? "h-[85vh] w-full rounded-t-3xl border-t z-panels"
              : "w-[50vw] h-full z-panels"
          } 
          overflow-y-auto p-4 sm:p-6 data-[state=open]:duration-300
        `}
      >
        <SheetHeader className="space-y-2">
          {/* Handle pour mobile */}
          {isMobile && (
            <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4" />
          )}

          <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4 gap-4">
            <Image
              src={country.flags.svg}
              alt={`Flag of ${country.name.common}`}
              width={80}
              height={60}
              className="shadow-lg mx-auto sm:mx-0"
            />
            <div className="flex-1 text-center sm:text-left">
              <SheetTitle className="text-xl sm:text-2xl font-bold">
                {country.name.common}
              </SheetTitle>
              <p className="text-muted-foreground text-base sm:text-lg">
                {country.name.official}
              </p>
              <Badge variant="outline" className="mt-2">
                {country.cca2}
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <Separator className="my-4" />

        <div className="space-y-4 sm:space-y-6">
          {/* General Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="w-5 h-5" />
                General Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Capital</p>
                    <p className="font-medium text-sm sm:text-base">
                      {country.capital?.join(", ") || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Region</p>
                    <p className="font-medium text-sm sm:text-base">
                      {country.region}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-purple-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Population</p>
                    <p className="font-medium text-sm sm:text-base">
                      {formatNumber(country.population)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Country Code
                    </p>
                    <p className="font-medium text-sm sm:text-base">
                      {country.cca2}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Languages & Currencies, Location, and External Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coins className="w-5 h-5" />
                Languages & Currencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Colonne gauche */}
                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {country.languages ? (
                        Object.values(country.languages).map((lang) => (
                          <Badge
                            key={lang}
                            variant="secondary"
                            className="text-xs"
                          >
                            {lang}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          N/A
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Currencies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {country.currencies ? (
                        Object.entries(country.currencies).map(
                          ([code, currency]) => (
                            <Badge
                              key={code}
                              variant="secondary"
                              className="text-xs"
                            >
                              {currency.name} ({currency.symbol || code})
                            </Badge>
                          )
                        )
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          N/A
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Colonne droite */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location
                    </h4>
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Coordinates
                      </p>
                      <p className="font-mono text-sm sm:text-base">
                        {country.latlng[0].toFixed(4)},{" "}
                        {country.latlng[1].toFixed(4)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Explore More
                    </h4>
                    <Button
                      variant="outline"
                      className="w-full justify-start cursor-pointer"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(
                          country.name.common
                        )}/@${country.latlng[0]},${
                          country.latlng[1]
                        },6z/data=!3m1!4b1`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View on Google Maps
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer avec bouton de comparaison */}
        {onAddToComparison && (
          <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t p-4 mt-6">
            {isInComparison ? (
              <div className="space-y-2">
                <Button
                  onClick={() => onAddToComparison(country)}
                  disabled
                  className="w-full"
                  variant="secondary"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Added to comparison
                </Button>
                {onOpenComparison && comparisonCount >= 2 && (
                  <Button
                    onClick={onOpenComparison}
                    className="w-full cursor-pointer"
                    variant="outline"
                  >
                    <Scale className="w-4 h-4 mr-2" />
                    View Comparison ({comparisonCount})
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Button
                  onClick={() => onAddToComparison(country)}
                  disabled={!canAddMore}
                  className="w-full cursor-pointer"
                  variant="default"
                >
                  <Scale className="w-4 h-4 mr-2" />
                  Add to comparison
                </Button>
                {!canAddMore && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    Maximum 4 countries can be compared
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users, Coins, Globe, Clock } from "lucide-react";
import Image from "next/image";
import { Country } from "../types/country";

interface CountryModalProps {
  country: Country | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryModal({
  country,
  isOpen,
  onClose,
}: CountryModalProps) {
  if (!country) return null;

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getLanguages = () => {
    if (!country.languages) return "N/A";
    return Object.values(country.languages).join(", ");
  };

  const getCurrencies = () => {
    if (!country.currencies) return "N/A";
    return Object.entries(country.currencies)
      .map(
        ([code, currency]) => `${currency.name} (${currency.symbol || code})`
      )
      .join(", ");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 
                       w-full max-w-2xl max-h-[90vh] overflow-y-auto
                       bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={onClose}
                className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800
                           transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-4">
                <Image
                  src={country.flags.svg}
                  alt={`Flag of ${country.name.common}`}
                  width={64}
                  height={48}
                  className="shadow-md"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {country.name.common}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    {country.name.official}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Capital
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {country.capital?.join(", ") || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Region
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {country.region}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Population
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {formatNumber(country.population)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Currency
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getCurrencies()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Languages
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {getLanguages()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Code
                      </p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {country.cca2}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Info */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Coordinates
                    </p>
                    <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                      {country.latlng[0].toFixed(4)},{" "}
                      {country.latlng[1].toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <a
                  href={country.maps.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white 
                           py-2 px-4 rounded-lg transition-colors duration-200 
                           text-center font-medium"
                >
                  View on Google Maps
                </a>
                <a
                  href={country.maps.openStreetMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white 
                           py-2 px-4 rounded-lg transition-colors duration-200 
                           text-center font-medium"
                >
                  View on OpenStreetMap
                </a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

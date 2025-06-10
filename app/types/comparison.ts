import { Country } from "./country";

export interface CountryMetric {
  label: string;
  key: keyof Country | string;
  format: "number" | "currency" | "area" | "list" | "text";
  getValue: (country: Country) => string | number | string[];
}

export interface ComparisonCategory {
  name: string;
  metrics: CountryMetric[];
}

export const COMPARISON_CATEGORIES: ComparisonCategory[] = [
  {
    name: "General Information",
    metrics: [
      {
        label: "Official Name",
        key: "name",
        format: "text",
        getValue: (country) => country.name.official,
      },
      {
        label: "Capital",
        key: "capital",
        format: "list",
        getValue: (country) => country.capital || ["N/A"],
      },
      {
        label: "Region",
        key: "region",
        format: "text",
        getValue: (country) => country.region,
      },
      {
        label: "Country Code",
        key: "cca2",
        format: "text",
        getValue: (country) => country.cca2,
      },
    ],
  },
  {
    name: "Demographics",
    metrics: [
      {
        label: "Population",
        key: "population",
        format: "number",
        getValue: (country) => country.population,
      },
    ],
  },
  {
    name: "Languages",
    metrics: [
      {
        label: "Official Languages",
        key: "languages",
        format: "list",
        getValue: (country) =>
          country.languages ? Object.values(country.languages) : ["N/A"],
      },
    ],
  },
  {
    name: "Currencies",
    metrics: [
      {
        label: "Currencies",
        key: "currencies",
        format: "list",
        getValue: (country) => {
          if (!country.currencies) return ["N/A"];
          return Object.values(country.currencies).map(
            (curr) => `${curr.name} (${curr.symbol || "N/A"})`
          );
        },
      },
    ],
  },
];

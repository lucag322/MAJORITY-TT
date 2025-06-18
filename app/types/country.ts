export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: { [key: string]: { official: string; common: string } };
  };
  capital?: string[];
  region: string;
  population: number;
  languages?: { [key: string]: string };
  currencies?: {
    [key: string]: {
      name: string;
      symbol?: string;
    };
  };
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  cca2: string;
  latlng: [number, number];
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
}

export interface CountryPosition {
  country: Country;
  position: [number, number, number];
  rotation: [number, number, number];
}
 
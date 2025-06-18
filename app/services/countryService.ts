import axios from "axios";
import { Country } from "../types/country";

const BASE_URL = "https://restcountries.com/v3.1";

class CountryService {
  private cache: Map<string, Country[]> = new Map();
  private positionsCache: Map<string, Array<[number, number, number]>> =
    new Map();

  async getAllCountries(): Promise<Country[]> {
    const cacheKey = "all_countries";

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Utiliser la syntaxe correcte de l'API REST Countries avec les fields en query string
      // L'API requiert obligatoirement le paramètre fields pour l'endpoint /all (max 10 champs)
      const response = await axios.get(
        `${BASE_URL}/all?fields=name,capital,region,population,languages,currencies,flags,cca2,latlng,maps`
      );

      const countries: Country[] = response.data;
      this.cache.set(cacheKey, countries);

      return countries;
    } catch {
      // Essayer sans filtres si ça ne marche pas
      try {
        const fallbackResponse = await axios.get(`${BASE_URL}/all`);
        const countries: Country[] = fallbackResponse.data;
        this.cache.set(cacheKey, countries);
        return countries;
      } catch {
        throw new Error("Failed to fetch countries data");
      }
    }
  }

  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await axios.get(`${BASE_URL}/alpha/${code}`);
      return response.data[0] || null;
    } catch {
      return null;
    }
  }

  async searchCountries(query: string): Promise<Country[]> {
    try {
      const response = await axios.get(`${BASE_URL}/name/${query}`);
      return response.data;
    } catch {
      return [];
    }
  }

  // Générer des positions uniformément distribuées sur une sphère (spirale de Fibonacci) - avec cache
  generateSpherePositions(
    count: number,
    radius: number = 8
  ): Array<[number, number, number]> {
    const cacheKey = `${count}-${radius}`;

    if (this.positionsCache.has(cacheKey)) {
      return this.positionsCache.get(cacheKey)!;
    }

    const positions: Array<[number, number, number]> = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2; // Nombre d'or

    for (let i = 0; i < count; i++) {
      // Utilisation de la spirale de Fibonacci pour une distribution uniforme optimale
      const y = 1 - (2 * i) / (count - 1); // y va de 1 à -1
      const radiusAtY = Math.sqrt(1 - y * y); // rayon du cercle à la hauteur y

      const theta = (2 * Math.PI * i) / goldenRatio; // angle basé sur le nombre d'or

      const x = radiusAtY * Math.cos(theta);
      const z = radiusAtY * Math.sin(theta);

      // Appliquer le rayon désiré
      positions.push([x * radius, y * radius, z * radius]);
    }

    this.positionsCache.set(cacheKey, positions);
    return positions;
  }

  // Vérifier si deux positions sont trop proches (pour éviter les chevauchements)
  private isPositionTooClose(
    pos1: [number, number, number],
    pos2: [number, number, number],
    minDistance: number = 2
  ): boolean {
    const dx = pos1[0] - pos2[0];
    const dy = pos1[1] - pos2[1];
    const dz = pos1[2] - pos2[2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    return distance < minDistance;
  }
}

export const countryService = new CountryService();
 
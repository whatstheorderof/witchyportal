import "server-only";
import tzlookup from "@photostructure/tz-lookup";

/**
 * Offline place search from GeoNames "cities1000" (via the `all-the-cities`
 * package, CC-BY GeoNames data): every populated place with ≥1000 people.
 * Time zones are resolved from coordinates with tz-lookup (IANA zone ids).
 * No birthplace is ever sent to a third-party service.
 */

interface City {
  cityId: number;
  name: string;
  altName: string;
  country: string;
  population: number;
  loc: { coordinates: [number, number] };
}

export interface Place {
  id: number;
  label: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timeZone: string;
}

let cache: { cities: City[]; keys: string[] } | null = null;

const fold = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

async function load() {
  if (!cache) {
    const mod = await import("all-the-cities");
    const cities = (mod.default ?? mod) as unknown as City[];
    cache = { cities, keys: cities.map((c) => fold(c.name)) };
  }
  return cache;
}

const regionNames = new Intl.DisplayNames(["en"], { type: "region" });

function toPlace(c: City): Place {
  const [lon, lat] = c.loc.coordinates;
  let country = c.country;
  try {
    country = regionNames.of(c.country) ?? c.country;
  } catch {}
  return {
    id: c.cityId,
    name: c.name,
    country,
    label: `${c.name}, ${country}`,
    latitude: lat,
    longitude: lon,
    timeZone: tzlookup(lat, lon),
  };
}

export async function searchPlaces(query: string, limit = 8): Promise<Place[]> {
  const q = fold(query.split(",")[0] ?? "");
  const countryHint = fold(query.split(",")[1] ?? "");
  if (q.length < 2) return [];
  const { cities, keys } = await load();
  const hits: { c: City; score: number }[] = [];
  for (let i = 0; i < cities.length; i++) {
    const k = keys[i];
    let score = 0;
    if (k === q) score = 3;
    else if (k.startsWith(q)) score = 2;
    else if (q.length >= 4 && k.includes(q)) score = 1;
    if (!score) continue;
    if (countryHint) {
      const cn = fold(toPlace(cities[i]).country);
      if (!cn.startsWith(countryHint) && fold(cities[i].country) !== countryHint) continue;
    }
    hits.push({ c: cities[i], score });
  }
  hits.sort(
    (a, b) => b.score - a.score || b.c.population - a.c.population,
  );
  return hits.slice(0, limit).map((h) => toPlace(h.c));
}

export async function getPlace(id: number): Promise<Place | null> {
  const { cities } = await load();
  const c = cities.find((x) => x.cityId === id);
  return c ? toPlace(c) : null;
}

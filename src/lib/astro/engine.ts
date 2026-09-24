import * as Astronomy from "astronomy-engine";
import { localToUtc } from "./timezone";
import {
  type Angle,
  type Aspect,
  type BirthInput,
  type BodyName,
  type ChartProvider,
  type ChartResult,
  type HouseSystem,
  type Placement,
  type Sign,
  signOf,
} from "./types";

/**
 * Chart calculation using astronomy-engine (MIT licence,
 * https://github.com/cosinekitty/astronomy), which models planetary positions
 * with VSOP87/NOVAS-grade accuracy (better than 1 arcminute for the bodies
 * used here).
 *
 * Conventions (documented in docs/BIRTH_CHART.md):
 *  - Zodiac: tropical, measured on the true ecliptic of date.
 *  - Positions: apparent geocentric (light-time and aberration corrected).
 *  - Houses: Placidus; Whole Sign above ±66° latitude where Placidus fails.
 *  - Lunar node: mean North Node.
 */

const PLANETS: [BodyName, Astronomy.Body][] = [
  ["Mercury", Astronomy.Body.Mercury],
  ["Venus", Astronomy.Body.Venus],
  ["Mars", Astronomy.Body.Mars],
  ["Jupiter", Astronomy.Body.Jupiter],
  ["Saturn", Astronomy.Body.Saturn],
  ["Uranus", Astronomy.Body.Uranus],
  ["Neptune", Astronomy.Body.Neptune],
  ["Pluto", Astronomy.Body.Pluto],
];

const rad = Math.PI / 180;
const norm = (x: number) => ((x % 360) + 360) % 360;

function bodyLongitude(name: BodyName, time: Astronomy.AstroTime): number {
  if (name === "Sun") return norm(Astronomy.SunPosition(time).elon);
  if (name === "Moon") return norm(Astronomy.EclipticGeoMoon(time).lon);
  if (name === "North Node") {
    // Mean ascending node of the Moon (Meeus, Astronomical Algorithms 47.7)
    const T = time.tt / 36525;
    return norm(
      125.0445479 -
        1934.1362891 * T +
        0.0020754 * T * T +
        (T * T * T) / 467441 -
        (T * T * T * T) / 60616000,
    );
  }
  const body = PLANETS.find(([n]) => n === name)![1];
  const vec = Astronomy.GeoVector(body, time, true);
  return norm(Astronomy.Ecliptic(vec).elon);
}

const ALL_BODIES: BodyName[] = [
  "Sun",
  "Moon",
  ...PLANETS.map(([n]) => n),
  "North Node",
];

function isRetrograde(name: BodyName, time: Astronomy.AstroTime): boolean {
  if (name === "Sun" || name === "Moon") return false;
  if (name === "North Node") return true; // mean node always moves backwards
  const a = bodyLongitude(name, time.AddDays(-0.5));
  const b = bodyLongitude(name, time.AddDays(0.5));
  let diff = b - a;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;
  return diff < 0;
}

function obliquity(time: Astronomy.AstroTime): number {
  return Astronomy.e_tilt(time).tobl;
}

/** Local apparent sidereal time expressed as RAMC in degrees. */
function ramc(time: Astronomy.AstroTime, longitude: number): number {
  return norm(Astronomy.SiderealTime(time) * 15 + longitude);
}

function raToEclipticLongitude(ra: number, eps: number): number {
  return norm(
    Math.atan2(Math.sin(ra * rad), Math.cos(ra * rad) * Math.cos(eps * rad)) /
      rad,
  );
}

export function computeAngles(
  time: Astronomy.AstroTime,
  latitude: number,
  longitude: number,
) {
  const eps = obliquity(time);
  const R = ramc(time, longitude);
  const mc = raToEclipticLongitude(R, eps);
  let asc = norm(
    Math.atan2(
      Math.cos(R * rad),
      -(
        Math.sin(R * rad) * Math.cos(eps * rad) +
        Math.tan(latitude * rad) * Math.sin(eps * rad)
      ),
    ) / rad,
  );
  // The Ascendant must lie in the eastern half, 0–180° ahead of the MC.
  if (norm(asc - mc) > 180) asc = norm(asc + 180);
  return { asc, mc, eps, ramc: R };
}

function placidusCusps(
  R: number,
  eps: number,
  lat: number,
  asc: number,
  mc: number,
): number[] | null {
  const tanLat = Math.tan(lat * rad);
  const cusp = (offset: number, fraction: number, nocturnal: boolean) => {
    let ra = norm(R + offset);
    for (let i = 0; i < 50; i++) {
      const lambda = raToEclipticLongitude(ra, eps);
      const decl = Math.asin(Math.sin(eps * rad) * Math.sin(lambda * rad));
      const x = tanLat * Math.tan(decl);
      if (Math.abs(x) >= 1) return null;
      const ad = Math.asin(x) / rad;
      const next = nocturnal
        ? norm(R + 180 - fraction * (90 - ad))
        : norm(R + fraction * (90 + ad));
      if (Math.abs(next - ra) < 1e-9) break;
      ra = next;
    }
    return raToEclipticLongitude(ra, eps);
  };
  const c11 = cusp(30, 1 / 3, false);
  const c12 = cusp(60, 2 / 3, false);
  const c2 = cusp(120, 2 / 3, true);
  const c3 = cusp(150, 1 / 3, true);
  if ([c11, c12, c2, c3].some((c) => c === null)) return null;
  const cusps = [
    asc,
    c2!,
    c3!,
    norm(mc + 180),
    norm(c11! + 180),
    norm(c12! + 180),
    norm(asc + 180),
    norm(c2! + 180),
    norm(c3! + 180),
    mc,
    c11!,
    c12!,
  ];
  return cusps;
}

function wholeSignCusps(asc: number): number[] {
  const start = Math.floor(asc / 30) * 30;
  return Array.from({ length: 12 }, (_, i) => norm(start + i * 30));
}

function houseOf(longitude: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const start = cusps[i];
    const end = cusps[(i + 1) % 12];
    const span = norm(end - start);
    if (norm(longitude - start) < span) return i + 1;
  }
  return 1;
}

const ASPECTS: { type: Aspect["type"]; angle: number; orb: number }[] = [
  { type: "conjunction", angle: 0, orb: 8 },
  { type: "sextile", angle: 60, orb: 5 },
  { type: "square", angle: 90, orb: 7 },
  { type: "trine", angle: 120, orb: 7 },
  { type: "opposition", angle: 180, orb: 8 },
];

function findAspects(placements: Placement[]): Aspect[] {
  const list = placements.filter(
    (p) => p.body !== "North Node" && !p.signUncertain,
  );
  const out: Aspect[] = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      let sep = Math.abs(list[i].longitude - list[j].longitude);
      if (sep > 180) sep = 360 - sep;
      for (const a of ASPECTS) {
        const orb = Math.abs(sep - a.angle);
        if (orb <= a.orb) {
          out.push({
            a: list[i].body,
            b: list[j].body,
            type: a.type,
            orb: Math.round(orb * 100) / 100,
          });
        }
      }
    }
  }
  return out.sort((x, y) => x.orb - y.orb);
}

/**
 * Resolve local birth time to UTC. Before a region adopted standard time the
 * tz database records Local Mean Time for the zone's reference city only
 * (e.g. Berlin for all of Germany). In that case we use true Local Mean Time
 * for the birthplace's own longitude, as astrologers conventionally do.
 */
export function resolveUtc(input: BirthInput, time: string) {
  const z = localToUtc(input.date, time, input.timeZone);
  const notes = [...z.notes];
  const isLmt =
    Math.abs(z.offsetMinutes % 15) > 1e-6 && input.timeZone !== "UTC";
  if (isLmt) {
    const [y, mo, d] = input.date.split("-").map(Number);
    const [h, mi] = time.split(":").map(Number);
    const wall = new Date(0);
    wall.setUTCFullYear(y, mo - 1, d);
    wall.setUTCHours(h, mi, 0, 0);
    const lmtOffsetMinutes = input.longitude * 4;
    return {
      utc: new Date(wall.getTime() - lmtOffsetMinutes * 60000),
      offsetMinutes: lmtOffsetMinutes,
      notes: [
        ...notes,
        "Standard time zones were not yet in use here on this date, so Local Mean Time for the birthplace's longitude was used.",
      ],
    };
  }
  return { utc: z.utc, offsetMinutes: z.offsetMinutes, notes };
}

export function calculateChart(input: BirthInput): ChartResult {
  const notes: string[] = [];
  const timeKnown = Boolean(input.time);

  const toUtc = (t: string) => resolveUtc(input, t);
  const resolved = toUtc(timeKnown ? input.time! : "12:00");
  const utc = resolved.utc;
  const offsetMinutes: number | null = resolved.offsetMinutes;
  notes.push(...resolved.notes);

  const time = Astronomy.MakeTime(utc);
  const dayStart = timeKnown ? null : Astronomy.MakeTime(toUtc("00:00").utc);
  const dayEnd = timeKnown ? null : Astronomy.MakeTime(toUtc("23:59").utc);

  let angles: Angle[] = [];
  let cusps: number[] | null = null;
  let houseSystem: HouseSystem | null = null;

  if (timeKnown) {
    const { asc, mc, eps, ramc: R } = computeAngles(
      time,
      input.latitude,
      input.longitude,
    );
    const mk = (name: Angle["name"], l: number): Angle => ({
      name,
      longitude: l,
      ...signOf(l),
    });
    angles = [
      mk("Ascendant", asc),
      mk("Midheaven", mc),
      mk("Descendant", norm(asc + 180)),
      mk("Imum Coeli", norm(mc + 180)),
    ];
    if (Math.abs(input.latitude) < 66) {
      cusps = placidusCusps(R, eps, input.latitude, asc, mc);
    }
    if (cusps) {
      houseSystem = "placidus";
    } else {
      cusps = wholeSignCusps(asc);
      houseSystem = "whole-sign";
      notes.push(
        "Placidus houses cannot be calculated this close to the poles, so Whole Sign houses are shown instead.",
      );
    }
  }

  const placements: Placement[] = ALL_BODIES.map((body) => {
    const longitude = bodyLongitude(body, time);
    const { sign, degree } = signOf(longitude);
    let signUncertain = false;
    let possibleSigns: Sign[] | undefined;
    if (!timeKnown && dayStart && dayEnd) {
      const s0 = signOf(bodyLongitude(body, dayStart)).sign;
      const s1 = signOf(bodyLongitude(body, dayEnd)).sign;
      if (s0 !== s1) {
        signUncertain = true;
        possibleSigns = [s0, s1];
      }
    }
    return {
      body,
      longitude,
      sign,
      degree,
      retrograde: isRetrograde(body, time),
      house: cusps ? houseOf(longitude, cusps) : null,
      signUncertain,
      possibleSigns,
    };
  });

  if (!timeKnown) {
    notes.push(
      "Without a birth time the Ascendant, Midheaven and houses cannot be determined, and the Moon's exact degree is uncertain (it moves about 13° a day). Positions are shown for local noon.",
    );
  }

  return {
    provider: {
      id: "astronomy-engine",
      name: "Astronomy Engine",
      version: "2.x",
    },
    isFixture: false,
    input,
    utc: utc.toISOString(),
    utcOffsetMinutes: offsetMinutes,
    timeKnown,
    notes,
    zodiac: "tropical",
    houseSystem,
    placements,
    angles,
    houseCusps: cusps,
    aspects: findAspects(placements),
  };
}

export const astronomyEngineProvider: ChartProvider = {
  id: "astronomy-engine",
  async calculate(input) {
    return calculateChart(input);
  },
};

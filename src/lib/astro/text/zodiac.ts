import type { Sign } from "../types";
import type { ZodiacEntry } from "./types";
import { ZODIAC_1 } from "./zodiac-1";
import { ZODIAC_2 } from "./zodiac-2";

/** Reference guide for each sign — powers /zodiac and /zodiac/[sign]. */
export const ZODIAC = { ...ZODIAC_1, ...ZODIAC_2 } as Record<Sign, ZodiacEntry>;

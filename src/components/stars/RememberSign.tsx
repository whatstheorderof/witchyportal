"use client";

import { useEffect } from "react";
import type { Sign } from "@/lib/astro/types";
import { getMySign, setMySign } from "@/lib/my-sign";

/** Reading a sign's horoscope sets it as "your sign" if none has been chosen yet. */
export function RememberSign({ sign }: { sign: Sign }) {
  useEffect(() => { if (!getMySign()) setMySign(sign); }, [sign]);
  return null;
}

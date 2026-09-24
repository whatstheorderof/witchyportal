import { NextResponse, type NextRequest } from "next/server";
import { searchPlaces } from "@/lib/astro/places";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 80);
  try {
    const places = await searchPlaces(q, 8);
    return NextResponse.json({ places }, { headers: { "Cache-Control": "public, max-age=86400" } });
  } catch (e) {
    console.error("place search failed", e);
    return NextResponse.json({ places: [], error: "Place search is unavailable" }, { status: 503 });
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { syncChannel } from "@/lib/youtube-sync";

/**
 * Called once a day by Vercel Cron (see vercel.json). Vercel sends
 * "Authorization: Bearer $CRON_SECRET" when CRON_SECRET is set.
 */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  try {
    const result = await syncChannel();
    if (result.added) revalidatePath("/", "layout");
    return NextResponse.json(result);
  } catch (e) {
    console.error("youtube sync failed", e);
    return NextResponse.json({ error: "Sync failed" }, { status: 502 });
  }
}

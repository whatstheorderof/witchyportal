import "server-only";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { media } from "@/db/schema";
import type { PickerMedia } from "@/components/admin/MediaPicker";

export async function pickerMedia(): Promise<PickerMedia[]> {
  const rows = await db.select({ id: media.id, url: media.url, alt: media.alt, kind: media.kind }).from(media).orderBy(desc(media.createdAt));
  return rows;
}

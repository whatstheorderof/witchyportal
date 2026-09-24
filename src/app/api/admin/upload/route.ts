import { NextResponse, type NextRequest } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdmin } from "@/lib/auth";

/**
 * Issues short-lived client upload tokens for Vercel Blob so large images and
 * videos go straight from the admin's browser to storage (bypassing the
 * 4.5 MB serverless request limit). Admin session required.
 */
export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const admin = await getAdmin();
        if (!admin) throw new Error("Not authorised");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "video/mp4", "video/webm", "video/quicktime"],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
          cacheControlMaxAge: 60 * 60 * 24 * 365,
        };
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Upload failed" }, { status: 400 });
  }
}

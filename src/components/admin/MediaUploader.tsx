"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { upload } from "@vercel/blob/client";
import { registerMedia, uploadMediaLocal } from "@/app/admin/actions";

async function dimensions(file: File): Promise<{ width: number | null; height: number | null }> {
  const url = URL.createObjectURL(file);
  try {
    if (file.type.startsWith("video/")) {
      return await new Promise((res) => {
        const v = document.createElement("video");
        v.onloadedmetadata = () => res({ width: v.videoWidth || null, height: v.videoHeight || null });
        v.onerror = () => res({ width: null, height: null });
        v.src = url;
      });
    }
    return await new Promise((res) => {
      const img = new Image();
      img.onload = () => res({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => res({ width: null, height: null });
      img.src = url;
    });
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}

export function MediaUploader({ blobEnabled }: { blobEnabled: boolean }) {
  const id = useId();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [alt, setAlt] = useState("");
  const [status, setStatus] = useState<{ kind: "idle" | "busy" | "ok" | "error"; msg?: string; pct?: number }>({ kind: "idle" });
  const isVideo = file?.type.startsWith("video/");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return setStatus({ kind: "error", msg: "Choose a file first" });
    if (!isVideo && !alt.trim()) return setStatus({ kind: "error", msg: "Please describe the image for people using screen readers (alt text)." });
    setStatus({ kind: "busy", pct: 0 });
    try {
      const dims = await dimensions(file);
      let url: string, pathname: string | null;
      if (blobEnabled) {
        const blob = await upload(`media/${file.name}`, file, {
          access: "public",
          handleUploadUrl: "/api/admin/upload",
          multipart: file.size > 20 * 1024 * 1024,
          onUploadProgress: ({ percentage }) => setStatus({ kind: "busy", pct: Math.round(percentage) }),
        });
        url = blob.url;
        pathname = blob.pathname;
      } else {
        const fd = new FormData();
        fd.append("file", file);
        ({ url, pathname } = await uploadMediaLocal(fd));
      }
      await registerMedia({ url, pathname, kind: isVideo ? "video" : "image", alt: alt.trim(), ...dims });
      setStatus({ kind: "ok", msg: "Uploaded." });
      setFile(null);
      setPreview(null);
      setAlt("");
      router.refresh();
    } catch (err) {
      setStatus({ kind: "error", msg: err instanceof Error ? err.message : "Upload failed" });
    }
  }

  return (
    <form onSubmit={submit} className="card grid gap-4 p-5 sm:grid-cols-[200px_1fr] sm:p-6">
      <div className="grid aspect-[4/3] place-items-center overflow-hidden rounded-xl bg-sand/60 text-sm text-muted">
        {preview ? (isVideo ? <video src={preview} className="h-full w-full object-cover" muted /> : /* eslint-disable-next-line @next/next/no-img-element */ <img src={preview} alt="" className="h-full w-full object-cover" />) : "Preview"}
      </div>
      <div className="grid content-start gap-4">
        <div>
          <label htmlFor={`${id}-f`} className="field-label">Image or video file</label>
          <input id={`${id}-f`} type="file" accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime" className="block w-full text-sm file:mr-4 file:min-h-11 file:rounded-full file:border-0 file:bg-plum file:px-5 file:text-ivory" onChange={(e) => { const f = e.target.files?.[0] ?? null; setFile(f); setPreview(f ? URL.createObjectURL(f) : null); setStatus({ kind: "idle" }); }} />
          <p className="field-hint">JPG, PNG, WebP or AVIF images (ideally 2000–3000px wide) or MP4/WebM video. Images are resized automatically for each screen.</p>
        </div>
        <div>
          <label htmlFor={`${id}-a`} className="field-label">Alt text {!isVideo && <span className="text-blush-deep">*</span>}</label>
          <input id={`${id}-a`} className="input" value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="e.g. Yulia dancing barefoot on the beach at sunset" maxLength={400} />
          <p className="field-hint">Describe what the image shows for visitors who can&rsquo;t see it.{isVideo ? " For background videos this can be left empty." : ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-primary min-h-11" disabled={status.kind === "busy" || !file}>{status.kind === "busy" ? `Uploading… ${status.pct ?? 0}%` : "Upload"}</button>
          <span role="status" aria-live="polite" className={`text-sm ${status.kind === "error" ? "text-danger" : "text-success"}`}>{status.msg}</span>
        </div>
        {!blobEnabled && <p className="text-xs text-warning">Development mode: files are saved to public/uploads. Set BLOB_READ_WRITE_TOKEN to use Vercel Blob.</p>}
      </div>
    </form>
  );
}

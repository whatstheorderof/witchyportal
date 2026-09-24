import type { Video } from "@/db/schema";
import { Check, F, Select } from "@/components/admin/AdminForm";
import { PublishFields } from "@/components/admin/PublishFields";
import { SITE_TIMEZONE, toDateTimeLocal } from "@/lib/dates";

export function VideoFields({ v }: { v?: Video }) {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <F label="YouTube link" name="url" defaultValue={v ? (v.kind === "short" ? `https://www.youtube.com/shorts/${v.youtubeId}` : `https://www.youtube.com/watch?v=${v.youtubeId}`) : ""} required mono placeholder="https://www.youtube.com/shorts/…" hint="Accepts youtube.com/watch, youtu.be, /shorts/ and /embed/ links." />
        <Select label="Format" name="kind" defaultValue={v?.kind ?? "short"} options={[{ value: "short", label: "Short (vertical)" }, { value: "video", label: "Video (landscape)" }]} />
      </div>
      <F label="Title / question" name="title" defaultValue={v?.title} required />
      <F label="Description" name="description" defaultValue={v?.description} textarea rows={3} />
      <div className="grid gap-4 sm:grid-cols-2"><F label="Topic" name="topic" defaultValue={v?.topic} /><F label="Sort order" name="sortOrder" type="number" defaultValue={v?.sortOrder ?? 0} /></div>
      <PublishFields status={v?.status ?? "published"} publishAt={toDateTimeLocal(v?.publishAt)} tz={SITE_TIMEZONE} />
      <Check label="Sample / placeholder" name="isPlaceholder" defaultChecked={v?.isPlaceholder} />
    </>
  );
}

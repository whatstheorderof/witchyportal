import type { Media, Post } from "@/db/schema";
import { ArticleCard, AstrologyCard, TipCard } from "./PostCards";
import { getI18n } from "@/i18n/server";

type P = Post & { cover: Media | null };

/** "Keep reading" strip shown under a post. Renders nothing when empty. */
export async function RelatedPosts({ posts, title }: { posts: P[]; title?: string }) {
  if (!posts.length) return null;
  const { t } = await getI18n();
  title ??= t("Keep reading");
  return (
    <section aria-labelledby="related-heading" className="container-page border-t border-line py-14 lg:py-20">
      <h2 id="related-heading" className="display-md">{title}</h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) =>
          p.type === "article" ? <ArticleCard key={p.id} post={p} index={i + 1} /> : p.type === "astrology" ? <AstrologyCard key={p.id} post={p} index={i + 1} /> : <TipCard key={p.id} post={p} index={i} />,
        )}
      </div>
    </section>
  );
}

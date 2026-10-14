/** Structured data for search engines. Pass one or more schema.org nodes (falsy entries are skipped). */
export function JsonLd({ data }: { data: (object | null | false | undefined)[] | object }) {
  const nodes = (Array.isArray(data) ? data : [data]).filter(Boolean);
  if (!nodes.length) return null;
  const json = { "@context": "https://schema.org", "@graph": nodes };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json).replace(/</g, "\\u003c") }} />;
}

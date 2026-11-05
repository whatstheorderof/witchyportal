import ReactMarkdown from "react-markdown";
import Link from "@/i18n/client";

/** Renders admin-authored Markdown. Raw HTML is not rendered (safe by default). */
export function Markdown({ children, className = "prose-witchy", lang }: { children: string; className?: string; lang?: string }) {
  return (
    <div lang={lang} className={className}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
            // Site links keep the visitor's language
            if (href?.startsWith("/") && !href.startsWith("//")) return <Link href={href}>{children}</Link>;
            const external = href?.startsWith("http");
            return <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{children}</a>;
          },
          img: () => null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function PlaceholderNote({ children = "Placeholder content — replace in Admin before launch" }: { children?: React.ReactNode }) {
  return <p className="placeholder-flag">✦ {children}</p>;
}

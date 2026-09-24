import ReactMarkdown from "react-markdown";

/** Renders admin-authored Markdown. Raw HTML is not rendered (safe by default). */
export function Markdown({ children, className = "prose-witchy" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        components={{
          a: ({ href, children }) => {
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

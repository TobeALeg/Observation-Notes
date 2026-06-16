import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 旧数据里可能还有 [[概念]] 写法；现在概念只作为 Glossary 辅助入口。
const WIKI = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
function preprocess(text: string): string {
  return text.replace(WIKI, (_, slug, label) => {
    const l = String(label ?? slug).trim();
    return `[${l}](/glossary)`;
  });
}

// markdown → 纯文本（卡片摘要用）
export function mdToPlain(text: string): string {
  return preprocess(text)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_~#>]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

const components = {
  p: (p: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-7 text-[15px] text-foreground/90 mb-3 last:mb-0" {...p} />
  ),
  strong: (p: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold text-foreground" {...p} />
  ),
  em: (p: React.HTMLAttributes<HTMLElement>) => <em className="italic" {...p} />,
  ul: (p: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="list-disc pl-5 space-y-1 mb-3 text-[15px] text-foreground/90" {...p} />
  ),
  ol: (p: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="list-decimal pl-5 space-y-1 mb-3 text-[15px] text-foreground/90" {...p} />
  ),
  li: (p: React.HTMLAttributes<HTMLLIElement>) => <li className="leading-7" {...p} />,
  blockquote: (p: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="border-l-2 border-primary/40 pl-4 text-muted my-3" {...p} />
  ),
  h1: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-lg font-semibold mt-5 mb-2" {...p} />
  ),
  h2: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="font-serif text-base font-semibold mt-4 mb-2" {...p} />
  ),
  h3: (p: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4 className="font-serif text-[15px] font-semibold mt-4 mb-2" {...p} />
  ),
  code: (p: React.HTMLAttributes<HTMLElement>) => (
    <code className="rounded bg-foreground/[0.06] px-1.5 py-0.5 text-[13px] font-mono" {...p} />
  ),
  pre: (p: React.HTMLAttributes<HTMLPreElement>) => (
    <pre
      className="rounded-lg bg-foreground/[0.04] border border-border p-3 overflow-x-auto text-[13px] my-3 font-mono"
      {...p}
    />
  ),
  hr: () => <hr className="my-4 border-border" />,
  table: (p: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-3">
      <table className="w-full text-sm border-collapse" {...p} />
    </div>
  ),
  th: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th className="border border-border px-3 py-1.5 text-left font-semibold bg-foreground/[0.03]" {...p} />
  ),
  td: (p: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td className="border border-border px-3 py-1.5" {...p} />
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
    if (href && href.startsWith("/")) {
      return (
        <Link
          href={href}
          className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
        >
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary"
      >
        {children}
      </a>
    );
  },
};

export default function Markdown({ text }: { text: string }) {
  return (
    <div className="markdown">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {preprocess(text)}
      </ReactMarkdown>
    </div>
  );
}

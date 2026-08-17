import Link from "next/link";
import type { CSSProperties } from "react";
import type { JudgmentCase } from "@/lib/cases";
import { mdToPlain } from "@/components/Markdown";
import { STATUS_STYLE } from "@/lib/statusStyle";

export default function CaseCard({
  item,
  variant = "featured",
}: {
  item: JudgmentCase;
  variant?: "featured" | "tab";
}) {
  const summary = mdToPlain(item.myJudgment || item.decisionQuestion || item.disagreement);
  const note = STATUS_STYLE[item.status];
  const concepts = item.concepts.length > 0 ? item.concepts : [item.phase || item.area];
  const daysAgo = getDaysAgo(item.date);

  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/case/${encodeURIComponent(item.id)}`}
      className={`${
        isFeatured
          ? "paper-note rough-paper group block px-6 py-5"
          : "tab-card group block"
      } transition-shadow duration-200 hover:-translate-y-0.5`}
      style={
        isFeatured
          ? ({
              "--note-bg": note.noteBg,
              "--note-border": note.noteBorder,
              "--tape-bg": note.tape,
              "--paper-edge": note.noteBorder,
            } as CSSProperties)
          : ({
              "--tab-bg": note.noteBg,
            } as CSSProperties)
      }
    >
      {isFeatured && (
        <svg
          className="rough-paper-boundary"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            fill="var(--note-bg, #fffdf7)"
            stroke="var(--paper-edge, #c9beaa)"
            d="M0.7 1.8 C10.5 0.3 18.6 1.7 27.4 1.1 C38.2 0.4 49.1 1.8 59.6 1.2 C71.2 0.5 82.9 1.4 99.1 0.8 C99.7 14.5 98.8 25.8 99.3 37.7 C99.8 50.2 99 62.9 99.6 74.6 C100 84.2 99.3 92.4 98.5 99 C83.6 98.4 72.4 99.4 60.3 98.8 C48.1 98.2 36.4 99.1 24.7 98.6 C16.7 98.2 9.2 99.3 1.2 98.1 C0.8 82.3 1.9 70.7 1 58.9 C0.2 48.2 1.6 37.7 0.8 26.4 C0.2 18.8 1.3 8.8 0.7 1.8 Z"
          />
        </svg>
      )}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`sketch-control px-3 py-1 text-xs font-semibold ${note.labelClass}`}>
          {item.status}
        </span>
        <span className="text-sm text-muted">{daysAgo}</span>
      </div>
      <h2 className="mb-5 font-serif text-[24px] font-semibold leading-snug tracking-tight text-foreground md:text-[26px]">
        {item.title}
      </h2>
      <div className="mb-4 grid gap-3 border-y py-3 text-xs text-muted sm:grid-cols-[0.7fr_0.75fr_1.4fr] sketch-rule">
        <div className="sm:border-r sm:pr-4 sketch-rule">
          <div className="mb-1 text-foreground/55">主题</div>
          <div className="font-medium text-foreground">{item.area}</div>
        </div>
        <div className="sm:border-r sm:px-4 sketch-rule">
          <div className="mb-1 text-foreground/55">对话日期</div>
          <time className="font-mono font-medium text-foreground">{item.date}</time>
        </div>
        <div className="sm:pl-4">
          <div className="mb-1 text-foreground/55">关联概念</div>
          <div className="flex flex-wrap gap-1.5">
            {concepts.slice(0, 3).map((concept) => (
              <span
                key={concept}
                className="sketch-chip bg-foreground/[0.07] px-2.5 py-0.5 font-medium text-foreground/75"
              >
                {concept}
              </span>
            ))}
          </div>
        </div>
      </div>
      {summary && (
        <p className="text-[14px] leading-6 text-foreground/85 line-clamp-2">
          {summary}
        </p>
      )}
      <div className="mt-4 flex items-center justify-between gap-4 text-sm text-foreground">
        <span className="min-w-0 truncate text-xs text-muted">关联对话：{item.id}.md</span>
        <span className="shrink-0 transition-transform group-hover:translate-x-1">
          查看详情 →
        </span>
      </div>
    </Link>
  );
}

function getDaysAgo(date: string) {
  const then = new Date(`${date}T00:00:00+08:00`).getTime();
  const now = new Date().getTime();
  const days = Math.max(0, Math.round((now - then) / 86_400_000));
  if (days === 0) return "今天";
  if (days === 1) return "昨天";
  if (days < 30) return `${days} 天前`;
  return "1 月前";
}

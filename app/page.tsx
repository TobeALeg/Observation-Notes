import Link from "next/link";
import type { CSSProperties } from "react";
import CaseCard from "@/components/CaseCard";
import StatusBadge from "@/components/StatusBadge";
import Tape from "@/components/Tape";
import ThesisFilter from "@/components/ThesisFilter";
import PageContainer from "@/components/PageContainer";
import { STATUS_STYLE } from "@/lib/statusStyle";
import { PAPER_COLORS } from "@/lib/paperPalette";
import { CASE_STATUSES } from "@/lib/constants";
import { getAllCases, getAllConcepts, getAllPrinciples, getThesisGroups } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ thesis?: string }>;
}) {
  const { thesis } = await searchParams;
  const allCases = getAllCases();
  const thesisGroups = getThesisGroups();
  const activeThesis =
    thesis && thesisGroups.some((g) => g.thesis === thesis) ? thesis : "";
  const cases = activeThesis
    ? allCases.filter((item) => item.thesis === activeThesis)
    : allCases;
  const principles = getAllPrinciples().slice(0, 4);
  const concepts = getAllConcepts().slice(0, 3);
  const featured = activeThesis ? cases : cases.slice(0, 3);
  const timeline = cases.slice(0, 4);
  const statusCounts = new Map(CASE_STATUSES.map((status) => [status, 0]));
  for (const item of cases) {
    statusCounts.set(item.status, (statusCounts.get(item.status) ?? 0) + 1);
  }

  return (
    <PageContainer width="full">
      <header className="mb-7 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="pt-2">
          <h1 className="mb-4 font-serif text-[64px] font-semibold leading-none tracking-tight text-foreground md:text-[78px]">
            <span className="marker-underline">判断分歧</span>
          </h1>
          <p className="max-w-xl text-[15px] leading-7 text-muted">
            记录我和老板在关键问题上的判断差异，验证现实给出的答案，
            为未来的自己留下可复盘的线索。
          </p>
        </div>
        <aside
          className="postit mt-2 min-h-[200px] px-7 pb-7 pt-11 rotate-[-2.5deg]"
          style={{ "--postit-bg": "#fff9c4" } as CSSProperties}
        >
          <p className="-mb-1 text-5xl leading-none text-primary/80">"</p>
          <p className="line-clamp-4 px-4 text-center font-serif text-lg leading-8 text-foreground/85">
            判断不是为了证明自己对，
            <br />
            而是为了离现实更近一步。
          </p>
          <p className="mt-5 text-right text-sm text-muted">— 2026-06-16</p>
        </aside>
      </header>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <FilterChip active label="全部" count={cases.length} />
          {CASE_STATUSES.filter((status) => (statusCounts.get(status) ?? 0) > 0).map(
            (status) => (
              <FilterChip
                key={status}
                label={status}
                count={statusCounts.get(status) ?? 0}
                dot={STATUS_STYLE[status].dot}
              />
            )
          )}
        </div>
        <div className="flex flex-wrap gap-3 lg:mr-[330px]">
          <ThesisFilter theses={thesisGroups.map((g) => g.thesis)} />
          <SelectControl label="最新优先" />
        </div>
      </div>

      <div className="grid gap-8 xl:grid-cols-[300px_minmax(0,1fr)_320px]">
        <aside className="xl:border-r xl:border-border xl:pr-8">
          <Tape label="时间线" />
          <div className="relative mt-7 space-y-7">
            <div className="absolute left-[9px] top-2 h-[calc(100%-28px)] border-l sketch-rule" />
            {timeline.map((item) => {
              const style = STATUS_STYLE[item.status];
              return (
                <Link
                  key={item.id}
                  href={`/case/${encodeURIComponent(item.id)}`}
                  className="relative grid grid-cols-[28px_58px_1fr] gap-3"
                >
                  <span className={`relative z-10 mt-1 h-5 w-5 rounded-full ${style.dot}`} />
                  <span className="font-mono text-foreground">
                    <span className="block text-lg leading-6">{item.date.slice(5)}</span>
                    <span className="block text-sm text-muted">{item.date.slice(0, 4)}</span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[15px] font-semibold leading-6 text-foreground line-clamp-2">
                      {item.title}
                    </span>
                    <span className="mt-2 inline-flex text-xs">
                      <StatusBadge status={item.status} />
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
          <Link
            href="/review"
            className="sketch-control mt-9 inline-flex bg-card px-5 py-2 text-sm text-foreground transition-colors hover:border-primary"
          >
            查看全部时间线 →
          </Link>
        </aside>

        <main className="space-y-5">
          <Tape
            label={activeThesis ? `主线 · ${activeThesis}` : "精选 Case"}
            color="#efc9b2"
          />
          {featured.length === 0 ? (
            <div className="sketch-control bg-card px-5 py-16 text-center text-muted">
              <p className="mb-2">还没有 Case</p>
              <p className="text-sm">
                发来一段复杂对话时，AI 会先拆出候选 Case，再写入这里。
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {featured.map((item, index) => (
                <div
                  key={item.id}
                  className={
                    index === 1
                      ? "lg:translate-x-[-2px]"
                      : index === 2
                        ? "lg:translate-x-[2px]"
                        : ""
                  }
                >
                  <CaseCard item={item} variant="featured" />
                </div>
              ))}
            </div>
          )}
        </main>

        <aside className="space-y-7 xl:border-l xl:border-border xl:pl-8">
          <section>
            <div className="mb-5 flex items-center justify-between">
              <Tape label="概念提醒" />
              <Link href="/glossary" className="text-xs text-muted hover:text-foreground">
                全部概念 →
              </Link>
            </div>
            <div className="space-y-3">
              {concepts.map((concept, index) => (
                <article
                  key={concept.title}
                  className="concept-slip"
                  style={
                    {
                      "--slip-bg": PAPER_COLORS[index % PAPER_COLORS.length].bg,
                      "--slip-border": PAPER_COLORS[index % PAPER_COLORS.length].border,
                      "--slip-rotate": `${(index % 3) * 1.2 - 1.2}deg`,
                      "--slip-rotate-hover": "0deg",
                    } as CSSProperties
                  }
                >
                  <h2 className="mb-1.5 font-serif text-base font-semibold text-foreground">
                    {concept.title}
                  </h2>
                  <p className="text-[13px] leading-6 text-foreground/75">
                    {concept.usage || concept.focus}
                  </p>
                  <span className="mt-2.5 inline-flex rounded-md bg-white/45 px-2 py-0.5 text-[11px] text-foreground/65">
                    最近更新
                  </span>
                </article>
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between">
              <Tape label="未来创业提醒" color="#f4dfa4" />
              <Link href="/principles" className="text-xs text-muted hover:text-foreground">
                全部提醒 →
              </Link>
            </div>
            {principles.length === 0 ? (
              <div className="sketch-control bg-card px-4 py-8 text-center text-sm text-muted">
                还没有原则
              </div>
            ) : (
              <div className="space-y-2.5">
                {principles.map((principle, index) => (
                  <div
                    key={principle.id}
                    className="concept-slip flex items-start gap-3"
                    style={
                      {
                        "--slip-bg": PAPER_COLORS[(index + 1) % PAPER_COLORS.length].bg,
                        "--slip-border": PAPER_COLORS[(index + 1) % PAPER_COLORS.length].border,
                        "--slip-rotate": `${(index % 3) * 0.8 - 0.8}deg`,
                        "--slip-rotate-hover": "0deg",
                      } as CSSProperties
                    }
                  >
                    <span className="sketch-control mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center bg-white/60 text-[10px] text-accent-green">
                      ✓
                    </span>
                    <span className="text-[13px] leading-6 text-foreground/85">
                      {principle.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </PageContainer>
  );
}

function FilterChip({
  label,
  count,
  active = false,
  dot,
}: {
  label: string;
  count: number;
  active?: boolean;
  dot?: string;
}) {
  return (
    <button
      className={`sketch-chip inline-flex h-10 items-center gap-2 px-4 text-sm transition-colors ${
        active
          ? "bg-ink text-white"
          : "bg-card text-muted hover:text-foreground"
      }`}
    >
      {dot && <span className={`h-2 w-2 rounded-full ${dot}`} />}
      <span>{label}</span>
      <span
        className={`sketch-chip px-2 py-0.5 text-xs ${
          active ? "bg-white/18 text-white" : "bg-foreground/[0.06] text-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function SelectControl({ label }: { label: string }) {
  return (
    <button className="sketch-control inline-flex h-10 items-center gap-2 bg-card px-4 text-sm text-foreground transition-colors hover:border-primary">
      {label}
      <span className="text-xs text-muted">⌄</span>
    </button>
  );
}

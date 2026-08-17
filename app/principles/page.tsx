import Link from "next/link";
import type { CSSProperties } from "react";
import Markdown from "@/components/Markdown";
import PageContainer from "@/components/PageContainer";
import { PAPER_COLORS } from "@/lib/paperPalette";
import { getAllCases, getAllPrinciples } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function PrinciplesPage() {
  const principles = getAllPrinciples();
  const caseTitles = new Map(getAllCases().map((item) => [item.id, item.title]));

  return (
    <PageContainer width="read">
      <header className="mb-8">
        <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight">
原则
        </h1>
        <p className="text-sm leading-7 text-muted">
          这里只有从多个 Case 里提炼出的创业提醒；单次对话里的概念解释放在 Glossary。
        </p>
      </header>

      {principles.length === 0 ? (
        <div className="sketch-control bg-card px-5 py-16 text-center text-muted">
          <p className="mb-2">还没有原则</p>
          <p className="text-sm">
            等 Case 被现实验证后，再从反复出现的模式里提炼。
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {principles.map((item, index) => (
            <article
              key={item.id}
              className="tab-card"
              style={
                {
                  "--tab-bg": PAPER_COLORS[index % PAPER_COLORS.length].bg,
                } as CSSProperties
              }
            >
              <h2 className="mb-3 font-serif text-2xl font-semibold leading-snug">
                {item.title}
              </h2>
              <Markdown text={item.body} />
              {item.sourceCases.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span>来源 Case</span>
                  {item.sourceCases.map((caseId) => (
                    <Link
                      key={caseId}
                      href={`/case/${encodeURIComponent(caseId)}`}
                      className="sketch-chip bg-white/55 px-2.5 py-1 text-foreground/75 hover:text-foreground"
                    >
                      {caseTitles.get(caseId) ?? caseId}
                    </Link>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

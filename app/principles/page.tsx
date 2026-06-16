import Link from "next/link";
import Markdown from "@/components/Markdown";
import { getAllCases, getAllPrinciples } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function PrinciplesPage() {
  const principles = getAllPrinciples();
  const caseTitles = new Map(getAllCases().map((item) => [item.id, item.title]));

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <header className="mb-8">
        <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight">
          原则
        </h1>
        <p className="text-sm leading-7 text-muted">
          这里只有从多个 Case 里提炼出的创业提醒；单次对话里的概念解释放在 Glossary。
        </p>
      </header>

      {principles.length === 0 ? (
        <div className="border border-dashed border-border px-5 py-16 text-center text-muted">
          <p className="mb-2">还没有原则</p>
          <p className="text-sm">
            等 Case 被现实验证后，再从反复出现的模式里提炼。
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {principles.map((item) => (
            <article key={item.id} className="border-b border-border pb-8">
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
                      className="border border-border px-2.5 py-1 hover:text-foreground"
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
    </div>
  );
}

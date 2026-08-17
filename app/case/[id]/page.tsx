import { notFound } from "next/navigation";
import Link from "next/link";
import BackLink from "@/components/BackLink";
import Markdown from "@/components/Markdown";
import StatusChanger from "@/components/StatusChanger";
import StatusBadge from "@/components/StatusBadge";
import PageContainer from "@/components/PageContainer";
import { getCase, getAllCases } from "@/lib/cases";
import { CASE_SECTIONS } from "@/lib/caseSections";

export const dynamic = "force-dynamic";

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getCase(decodeURIComponent(id));
  if (!item) notFound();
  const allCases = getAllCases();
  const caseTitles = new Map(allCases.map((c) => [c.id, c.title]));
  const siblings = item.thesis
    ? allCases.filter((c) => c.thesis === item.thesis && c.id !== item.id)
    : [];

  return (
    <PageContainer width="read">
      <div className="flex items-center justify-between">
        <BackLink fallbackHref="/">← 返回上页</BackLink>
        <Link
          href={`/case/${encodeURIComponent(item.id)}/edit`}
          className="sketch-chip bg-card px-4 py-1.5 text-sm text-primary transition-colors hover:border-primary"
        >
          编辑
        </Link>
      </div>

      <header className="mt-6 mb-9 border-b border-border pb-7">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <time className="font-mono">{item.date}</time>
          <span>/</span>
          <span>{item.area}</span>
          {item.phase && (
            <>
              <span>/</span>
              <span>{item.phase}</span>
            </>
          )}
          {item.thesis && (
            <>
              <span>/</span>
              <span className="text-primary">主线 · {item.thesis}</span>
            </>
          )}
        </div>
        <h1 className="mb-5 font-serif text-[32px] font-semibold leading-tight">
          {item.title}
        </h1>
        <div className="mb-5 text-sm">
          <StatusBadge status={item.status} />
        </div>
        <StatusChanger id={item.id} status={item.status} />

        {(item.concepts.length > 0 || item.relatedCases.length > 0 || siblings.length > 0) && (
          <div className="mt-5 space-y-3 text-xs text-muted">
            {siblings.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span>同一主线</span>
                {siblings.map((sib) => (
                  <Link
                    key={sib.id}
                    href={`/case/${encodeURIComponent(sib.id)}`}
                    className="sketch-chip bg-card px-2.5 py-1 text-foreground/75 transition-colors hover:text-foreground"
                  >
                    {sib.title}
                  </Link>
                ))}
              </div>
            )}
            {item.concepts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span>涉及概念</span>
                {item.concepts.map((concept) => (
                  <Link
                    key={concept}
                    href="/glossary"
                    className="sketch-chip bg-card px-2.5 py-1 text-primary transition-colors hover:border-primary"
                  >
                    {concept}
                  </Link>
                ))}
              </div>
            )}
            {item.relatedCases.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span>关联 Case</span>
                {item.relatedCases.map((caseId) => (
                  <Link
                    key={caseId}
                    href={`/case/${encodeURIComponent(caseId)}`}
                    className="sketch-chip bg-card px-2.5 py-1 text-foreground/75 transition-colors hover:text-foreground"
                  >
                    {caseTitles.get(caseId) ?? caseId}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </header>

      <div className="space-y-9">
        {CASE_SECTIONS.map((section) => {
          const text = item[section.key];
          if (section.key === "unresolvedReason" && !text && item.status !== "无解") {
            return null;
          }
          return (
            <section key={section.key}>
              <h2 className="mb-2.5 flex items-baseline gap-2 font-serif text-lg font-semibold">
                {section.label}
                <span className="font-sans text-xs font-normal text-muted">
                  {section.hint}
                </span>
              </h2>
              {text ? (
                <div className="text-foreground/90">
                  <Markdown text={text} />
                </div>
              ) : (
                <p className="text-sm italic text-muted">待补充</p>
              )}
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}

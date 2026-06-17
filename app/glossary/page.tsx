import { getGlossary } from "@/lib/cases";
import { PAPER_COLORS } from "@/lib/paperPalette";
import PageContainer from "@/components/PageContainer";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

interface ConceptEntry {
  title: string;
  focus: string;
  confusion: string;
  usage: string;
}

function cleanLine(text: string): string {
  return text
    .replace(/^\*\*([^*]+)\*\*：?/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function pickField(body: string, label: string): string {
  const line = body
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`**${label}**`));
  return line ? cleanLine(line) : "";
}

function parseConcepts(markdown: string): ConceptEntry[] {
  const firstConcept = markdown.search(/^##\s+/m);
  if (firstConcept === -1) return [];

  return markdown
    .slice(firstConcept)
    .split(/^##\s+/m)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [title = "", ...bodyLines] = part.split("\n");
      const body = bodyLines.join("\n");
      return {
        title: title.trim(),
        focus: pickField(body, "看点"),
        confusion: pickField(body, "别混淆"),
        usage: pickField(body, "判断用法"),
      };
    })
    .filter((entry) => entry.title);
}

export default async function GlossaryPage() {
  const entries = parseConcepts(getGlossary());

  return (
    <PageContainer width="wide">
      <header className="mb-9 border-b border-border pb-7">
        <h1 className="mb-3 font-serif text-[56px] font-semibold leading-none tracking-tight">
          <span className="marker-underline">概念提醒</span>
        </h1>
        <p className="max-w-2xl text-sm leading-7 text-muted">
          只保留对 Case 判断有用的商业和营销概念。重点不是背定义，而是看清边界、别混淆什么、判断时怎么用。
        </p>
      </header>

      {entries.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2">
          {entries.map((entry, index) => {
            const color = PAPER_COLORS[index % PAPER_COLORS.length];
            return (
            <article
              key={entry.title}
              className="paper-note draft-paper px-6 py-5"
              style={
                {
                  "--note-bg": color.bg,
                  "--note-border": color.border,
                  "--paper-edge": color.border,
                } as CSSProperties
              }
            >
              <h2 className="mb-5 font-serif text-2xl font-semibold leading-snug">
                {entry.title}
              </h2>
              <div className="space-y-4 text-sm leading-6">
                <ConceptField label="看点" value={entry.focus} />
                <ConceptField label="别混淆" value={entry.confusion} />
                <ConceptField label="判断用法" value={entry.usage} emphasis />
              </div>
            </article>
            );
          })}
        </div>
      ) : (
        <div className="border border-dashed border-border px-5 py-16 text-center text-muted">
          <p>还没有概念记录。</p>
        </div>
      )}
    </PageContainer>
  );
}

function ConceptField({
  label,
  value,
  emphasis = false,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
}) {
  return (
    <div className="grid gap-1 border-t border-foreground/10 pt-3 first:border-t-0 first:pt-0">
      <div className="text-xs font-semibold text-primary">{label}</div>
      <p className={emphasis ? "text-foreground" : "text-muted"}>{value || "待补充"}</p>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import StatusChanger from "@/components/StatusChanger";
import StatusBadge from "@/components/StatusBadge";
import { getCase, getAllCases } from "@/lib/cases";

export const dynamic = "force-dynamic";

const SECTIONS: {
  key:
    | "scene"
    | "decisionQuestion"
    | "bossJudgment"
    | "myJudgment"
    | "disagreement"
    | "validationSignals"
    | "result"
    | "unresolvedReason"
    | "founderReminder";
  label: string;
  hint: string;
}[] = [
  { key: "scene", label: "场景", hint: "发生了什么，约束是什么" },
  { key: "decisionQuestion", label: "决策问题", hint: "真正要判断的问题" },
  { key: "bossJudgment", label: "老板判断", hint: "他的选择和底层假设" },
  { key: "myJudgment", label: "我的判断", hint: "你的判断和底层假设" },
  { key: "disagreement", label: "分歧本质", hint: "差在目标、阶段、风险还是假设" },
  { key: "validationSignals", label: "验证信号", hint: "未来看哪些现实反馈" },
  { key: "result", label: "结果", hint: "发生了什么，谁更接近现实" },
  { key: "unresolvedReason", label: "为何无解", hint: "状态为无解时必须解释" },
  { key: "founderReminder", label: "给未来创业的提醒", hint: "这条 Case 最终要留下的东西" },
];

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getCase(decodeURIComponent(id));
  if (!item) notFound();
  const caseTitles = new Map(getAllCases().map((c) => [c.id, c.title]));

  return (
    <article className="mx-auto max-w-3xl px-5 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          返回 Cases
        </Link>
        <Link
          href={`/case/${encodeURIComponent(item.id)}/edit`}
          className="text-sm text-primary hover:underline underline-offset-2"
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
        </div>
        <h1 className="mb-5 font-serif text-[32px] font-semibold leading-tight">
          {item.title}
        </h1>
        <div className="mb-5 text-sm">
          <StatusBadge status={item.status} />
        </div>
        <StatusChanger id={item.id} status={item.status} />

        {(item.concepts.length > 0 || item.relatedCases.length > 0) && (
          <div className="mt-5 space-y-3 text-xs text-muted">
            {item.concepts.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span>涉及概念</span>
                {item.concepts.map((concept) => (
                  <Link
                    key={concept}
                    href="/glossary"
                    className="border border-primary/25 px-2.5 py-1 text-primary hover:bg-primary/5"
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
                    className="border border-border px-2.5 py-1 hover:text-foreground"
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
        {SECTIONS.map((section) => {
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
    </article>
  );
}

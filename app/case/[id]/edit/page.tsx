import Link from "next/link";
import { notFound } from "next/navigation";
import CaseEditor from "@/components/CaseEditor";
import PageContainer from "@/components/PageContainer";
import { getCase } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getCase(decodeURIComponent(id));
  if (!item) notFound();

  return (
    <PageContainer width="read">
      <header className="mb-7 border-b border-border pb-5">
        <Link
          href={`/case/${encodeURIComponent(item.id)}`}
          replace
          className="text-sm text-muted hover:text-foreground"
        >
          ← 回到 Case
        </Link>
        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-muted">
          <time className="font-mono">{item.date}</time>
          <span>/</span>
          <span>{item.area}</span>
          <span>/</span>
          <span>编辑定稿</span>
        </div>
        <h1 className="mt-3 font-serif text-3xl font-semibold leading-tight">
          编辑 Case
        </h1>
      </header>

      <CaseEditor
        initial={{
          id: item.id,
          title: item.title,
          area: item.area,
          scene: item.scene,
          decisionQuestion: item.decisionQuestion,
          bossJudgment: item.bossJudgment,
          myJudgment: item.myJudgment,
          disagreement: item.disagreement,
          validationSignals: item.validationSignals,
          result: item.result,
          unresolvedReason: item.unresolvedReason,
          founderReminder: item.founderReminder,
        }}
      />
    </PageContainer>
  );
}

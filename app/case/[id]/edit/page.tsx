import Link from "next/link";
import { notFound } from "next/navigation";
import CaseEditor from "@/components/CaseEditor";
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
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link
        href={`/case/${encodeURIComponent(item.id)}`}
        className="text-sm text-muted hover:text-foreground"
      >
        返回 Case
      </Link>

      <div className="mt-4 mb-7 flex items-center gap-2 text-xs text-muted">
        <time className="font-mono">{item.date}</time>
        <span>/</span>
        <span>定稿编辑</span>
      </div>

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
    </div>
  );
}

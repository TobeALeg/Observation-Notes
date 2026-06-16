import { NextResponse } from "next/server";
import { CASE_AREAS } from "@/lib/constants";
import { updateCase, type CaseEdit } from "@/lib/cases";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => null);
  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }

  const edit: CaseEdit = {
    title: String(body.title).trim(),
    area: (CASE_AREAS as readonly string[]).includes(body.area)
      ? String(body.area)
      : "未分类",
    scene: String(body.scene ?? ""),
    decisionQuestion: String(body.decisionQuestion ?? ""),
    bossJudgment: String(body.bossJudgment ?? ""),
    myJudgment: String(body.myJudgment ?? ""),
    disagreement: String(body.disagreement ?? ""),
    validationSignals: String(body.validationSignals ?? ""),
    result: String(body.result ?? ""),
    unresolvedReason: String(body.unresolvedReason ?? ""),
    founderReminder: String(body.founderReminder ?? ""),
  };

  const ok = updateCase(decodeURIComponent(id), edit);
  if (!ok) {
    return NextResponse.json({ error: "找不到这个 Case" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

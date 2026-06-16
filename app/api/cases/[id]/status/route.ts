import { NextResponse } from "next/server";
import { CASE_STATUSES, updateCaseStatus, type CaseStatus } from "@/lib/cases";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status as CaseStatus;

  if (!(CASE_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "无效的状态" }, { status: 400 });
  }

  const ok = updateCaseStatus(decodeURIComponent(id), status);
  if (!ok) {
    return NextResponse.json({ error: "找不到这个 Case" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}

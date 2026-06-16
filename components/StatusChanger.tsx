"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CASE_STATUSES, type CaseStatus } from "@/lib/constants";
import { STATUS_STYLE } from "@/components/StatusBadge";

export default function StatusChanger({
  id,
  status,
}: {
  id: string;
  status: CaseStatus;
}) {
  const router = useRouter();
  const [current, setCurrent] = useState<CaseStatus>(status);
  const [pending, startTransition] = useTransition();

  async function change(next: CaseStatus) {
    if (next === current || pending) return;
    const prev = current;
    setCurrent(next);
    const res = await fetch(`/api/cases/${encodeURIComponent(id)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (!res.ok) {
      setCurrent(prev);
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-wrap items-center gap-1 border border-border bg-card p-1">
      {CASE_STATUSES.map((s) => {
        const active = s === current;
        const style = STATUS_STYLE[s];
        return (
          <button
            key={s}
            onClick={() => change(s)}
            disabled={pending}
            className={`px-3 py-1.5 text-sm transition-colors disabled:opacity-60 ${
              active
                ? `${style.chip} border`
                : "border border-transparent text-muted hover:text-foreground"
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
              {s}
            </span>
          </button>
        );
      })}
    </div>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CASE_AREAS } from "@/lib/constants";
import { CASE_SECTIONS } from "@/lib/caseSections";

export interface CaseEditorInitial {
  id: string;
  title: string;
  area: string;
  scene: string;
  decisionQuestion: string;
  bossJudgment: string;
  myJudgment: string;
  disagreement: string;
  validationSignals: string;
  result: string;
  unresolvedReason: string;
  founderReminder: string;
}

export default function CaseEditor({ initial }: { initial: CaseEditorInitial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const detailHref = `/case/${encodeURIComponent(initial.id)}`;

  function set<K extends keyof CaseEditorInitial>(key: K, value: CaseEditorInitial[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    if (!form.title.trim()) {
      setError("标题不能为空");
      return;
    }
    setSaving(true);
    setError("");
    const res = await fetch(`/api/cases/${encodeURIComponent(initial.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "保存失败");
      setSaving(false);
      return;
    }
    router.replace(detailHref);
    router.refresh();
  }

  const inputClass =
    "w-full sketch-control bg-card px-3.5 py-2.5 text-[15px] transition-colors focus:border-primary focus:outline-none";
  const textareaClass =
    "w-full resize-y border-0 border-t border-border bg-transparent px-0 py-3 text-[15px] leading-7 outline-none focus:border-primary";

  return (
    <div className="pb-28">
      <div className="mb-7 grid gap-3 sm:grid-cols-[1fr_160px]">
        <input
          className={`${inputClass} font-serif text-lg font-semibold`}
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="一句话 Case 标题"
        />
        <select
          className={inputClass}
          value={form.area}
          onChange={(e) => set("area", e.target.value)}
        >
          {CASE_AREAS.map((area) => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </select>
      </div>

      <div className="tab-card space-y-1 bg-card">
        {CASE_SECTIONS.map((section) => (
          <section
            key={section.key}
            className="border-t border-border/70 py-4 first:border-t-0 first:pt-0 last:pb-0"
          >
            <label className="block">
              <span className="flex flex-wrap items-baseline gap-2">
                <span className="font-serif text-lg font-semibold">
                  {section.label}
                </span>
                <span className="text-xs text-muted">{section.hint}</span>
              </span>
              <textarea
                className={`${textareaClass} ${
                  section.key === "unresolvedReason" ? "min-h-20" : "min-h-28"
                }`}
                value={form[section.key]}
                onChange={(e) => set(section.key, e.target.value)}
              />
            </label>
          </section>
        ))}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="sticky bottom-4 mt-6 flex items-center justify-between gap-3 rounded-[10px] border border-border bg-background/90 px-4 py-3 backdrop-blur">
        <p className="hidden text-xs text-muted sm:block">
          保存后返回 Case 详情
        </p>
        <div className="ml-auto flex items-center gap-3">
          <Link
            href={detailHref}
            replace
            aria-disabled={saving}
            className={`sketch-control bg-card px-5 py-2.5 text-sm text-muted transition-colors hover:text-foreground ${
              saving ? "pointer-events-none opacity-60" : ""
            }`}
          >
            取消
          </Link>
          <button
            onClick={save}
            disabled={saving}
            className="sketch-chip bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "保存中..." : "保存 Case"}
          </button>
        </div>
      </div>
    </div>
  );
}

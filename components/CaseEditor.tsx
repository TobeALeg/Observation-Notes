"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CASE_AREAS } from "@/lib/constants";

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

const SECTIONS: {
  key: Exclude<keyof CaseEditorInitial, "id" | "title" | "area">;
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
  { key: "unresolvedReason", label: "为何无解", hint: "无解时必须解释；否则可留空" },
  { key: "founderReminder", label: "给未来创业的提醒", hint: "未来自己要带走的原则" },
];

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
    router.push(detailHref);
    router.refresh();
  }

  const inputClass =
    "w-full border border-border bg-card px-3.5 py-2.5 text-[15px] transition-colors focus:border-primary focus:outline-none";

  return (
    <div className="space-y-7">
      <div className="grid gap-3 sm:grid-cols-[1fr_160px]">
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

      {SECTIONS.map((section) => (
        <div key={section.key}>
          <label className="mb-2 flex items-baseline gap-2 font-serif text-lg font-semibold">
            {section.label}
            <span className="font-sans text-xs font-normal text-muted">
              {section.hint}
            </span>
          </label>
          <textarea
            className={`${inputClass} min-h-28 resize-y leading-7`}
            value={form[section.key]}
            onChange={(e) => set(section.key, e.target.value)}
          />
        </div>
      ))}

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <button
          onClick={save}
          disabled={saving}
          className="bg-primary px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {saving ? "保存中..." : "保存 Case"}
        </button>
        <button
          onClick={() => router.push(detailHref)}
          disabled={saving}
          className="border border-border px-5 py-2.5 text-sm text-muted transition-colors hover:text-foreground"
        >
          取消
        </button>
      </div>
    </div>
  );
}

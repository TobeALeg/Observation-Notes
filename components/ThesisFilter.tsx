"use client";

import { useRouter, useSearchParams } from "next/navigation";

// 首页「全部主题」筛选：按 thesis（根分歧主线）过滤 Case。
// 用原生 select，选中后写进 URL ?thesis=，由服务端渲染过滤后的列表。
export default function ThesisFilter({ theses }: { theses: string[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get("thesis") ?? "";

  return (
    <label className="sketch-control inline-flex h-10 items-center gap-1 bg-card px-4 text-sm text-foreground transition-colors hover:border-primary">
      <select
        value={current}
        onChange={(e) => {
          const v = e.target.value;
          router.push(v ? `/?thesis=${encodeURIComponent(v)}` : "/");
        }}
        className="cursor-pointer bg-transparent pr-1 text-sm text-foreground focus:outline-none"
      >
        <option value="">全部主题</option>
        {theses.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
    </label>
  );
}

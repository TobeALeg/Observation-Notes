import type { CSSProperties } from "react";

// 手绘「胶带标签」，用作各页 section 小标题。颜色默认赭石，可按需覆盖。
export default function Tape({
  label,
  color = "#f4dfa4",
  className = "",
}: {
  label: string;
  color?: string;
  className?: string;
}) {
  return (
    <div
      className={`paper-label w-fit font-serif text-base font-semibold ${className}`}
      style={{ "--label-bg": color } as CSSProperties}
    >
      {label}
    </div>
  );
}

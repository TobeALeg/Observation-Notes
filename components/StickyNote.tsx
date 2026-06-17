import type { CSSProperties } from "react";

export default function StickyNote({
  label,
  text,
  bg,
  border,
  rotate = -2,
  className = "",
}: {
  label?: string;
  text: string;
  bg: string;
  border: string;
  rotate?: number;
  className?: string;
}) {
  if (!text) return null;
  return (
    <div
      className={`sticky-note ${className}`}
      style={{ "--sn-bg": bg, "--sn-border": border, "--sn-rotate": `${rotate}deg` } as CSSProperties}
    >
      {label && (
        <p className="mb-1.5 text-[10px] font-semibold tracking-wider uppercase opacity-60">
          {label}
        </p>
      )}
      <p className="text-[12.5px] leading-[1.65] text-foreground/85 line-clamp-4">{text}</p>
    </div>
  );
}

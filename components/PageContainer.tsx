import type { ReactNode } from "react";

// 统一各页的最大宽度与内边距，避免切页时内容边界跳动。
// full：与 Nav 对齐的宽幅（首页三栏）；wide：多栏列表（复盘 / 概念）；read：阅读 / 编辑（详情 / 原则 / 编辑）。
const MAX_WIDTH = {
  full: "max-w-[1512px]",
  wide: "max-w-6xl",
  read: "max-w-3xl",
} as const;

export default function PageContainer({
  width = "wide",
  className = "",
  children,
}: {
  width?: keyof typeof MAX_WIDTH;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mx-auto ${MAX_WIDTH[width]} px-6 py-10 md:px-8 ${className}`}>
      {children}
    </div>
  );
}

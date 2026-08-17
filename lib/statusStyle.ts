import type { CaseStatus } from "@/lib/constants";

// 6 种状态的唯一调色板：圆点 / 文字 / chip 标签（StatusBadge、StatusChanger 用），
// 以及手绘纸条配色 noteBg / noteBorder / tape 和实心标签 labelClass（CaseCard 用）。
// 每个状态用同一 hue 的多档颜色，保证全站同一状态颜色一致。
export interface StatusStyle {
  dot: string;
  text: string;
  chip: string;
  labelClass: string;
  noteBg: string;
  noteBorder: string;
  tape: string;
}

export const STATUS_STYLE: Record<CaseStatus, StatusStyle> = {
  待验证: {
    dot: "bg-[#6fa7c0]",
    text: "text-[#2f6176]",
    chip: "bg-[#eaf3f7] text-[#2f6176] border-[#c4d9e3]",
    labelClass: "bg-[#2f6176] text-white",
    noteBg: "#f5f9fb",
    noteBorder: "#c4d9e3",
    tape: "#d6e8ef",
  },
  我更接近: {
    dot: "bg-[#6ca36f]",
    text: "text-[#3f7143]",
    chip: "bg-[#eff5ec] text-[#3f7143] border-[#c8d8c0]",
    labelClass: "bg-[#3f7143] text-white",
    noteBg: "#f7faf4",
    noteBorder: "#c8d8c0",
    tape: "#d6e5cd",
  },
  老板更接近: {
    dot: "bg-[#6f83aa]",
    text: "text-[#445c87]",
    chip: "bg-[#eaeef5] text-[#445c87] border-[#c5cee0]",
    labelClass: "bg-[#445c87] text-white",
    noteBg: "#f6f8fc",
    noteBorder: "#c5cee0",
    tape: "#dbe0ef",
  },
  双方都错: {
    dot: "bg-[#be684f]",
    text: "text-[#884631]",
    chip: "bg-[#f6efe7] text-[#884631] border-[#e0cfbe]",
    labelClass: "bg-[#884631] text-white",
    noteBg: "#fef9f4",
    noteBorder: "#e0cfbe",
    tape: "#f0dbca",
  },
  混合结果: {
    dot: "bg-[#8b75aa]",
    text: "text-[#644d85]",
    chip: "bg-[#f3f0f7] text-[#644d85] border-[#d6cde0]",
    labelClass: "bg-[#644d85] text-white",
    noteBg: "#faf8fd",
    noteBorder: "#d6cde0",
    tape: "#e3dbef",
  },
  无解: {
    dot: "bg-[#9ba09c]",
    text: "text-[#5d6461]",
    chip: "bg-[#f0f2ef] text-[#5d6461] border-[#d3d8d4]",
    labelClass: "bg-[#5d6461] text-white",
    noteBg: "#f8f9f7",
    noteBorder: "#d3d8d4",
    tape: "#e2e5e1",
  },
};

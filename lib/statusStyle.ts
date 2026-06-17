import type { CaseStatus } from "@/lib/constants";

// 6 种状态的唯一调色板：圆点 / 文字 / chip 标签（StatusBadge、StatusChanger 用），
// 以及手绘纸条配色 noteBg / noteBorder / tape 和实心标签 labelClass（CaseCard 用）。
// 每个状态用同一 hue 的多档颜色，保证全站同一状态颜色一致。
export interface StatusStyle {
  dot: string; // class，小圆点底色
  text: string; // class，文字色
  chip: string; // class，浅底 + 文字 + 边框（badge / 选中态）
  labelClass: string; // class，实心标签底 + 白字（卡片角标）
  noteBg: string; // hex，纸条卡片底（内联 --note-bg）
  noteBorder: string; // hex，纸条边框（内联 --note-border / --paper-edge）
  tape: string; // hex，胶带色（内联 --tape-bg）
}

export const STATUS_STYLE: Record<CaseStatus, StatusStyle> = {
  待验证: {
    dot: "bg-[#6fa7c0]",
    text: "text-[#2f6176]",
    chip: "bg-[#dcecf4] text-[#2f6176] border-[#b8d4df]",
    labelClass: "bg-[#2f6176] text-white",
    noteBg: "#f6fbff",
    noteBorder: "#afd2e4",
    tape: "#cfe4ee",
  },
  我更接近: {
    dot: "bg-[#6ca36f]",
    text: "text-[#3f7143]",
    chip: "bg-[#e4efdf] text-[#3f7143] border-[#bdd8b6]",
    labelClass: "bg-[#3f7143] text-white",
    noteBg: "#f7fbf3",
    noteBorder: "#bdd7b3",
    tape: "#cfe7ca",
  },
  老板更接近: {
    dot: "bg-[#6f83aa]",
    text: "text-[#445c87]",
    chip: "bg-[#e1e7f2] text-[#445c87] border-[#bdc8de]",
    labelClass: "bg-[#445c87] text-white",
    noteBg: "#f6f8fd",
    noteBorder: "#bdc8de",
    tape: "#d6deef",
  },
  双方都错: {
    dot: "bg-[#be684f]",
    text: "text-[#884631]",
    chip: "bg-[#f3dfcf] text-[#884631] border-[#dfbca6]",
    labelClass: "bg-[#884631] text-white",
    noteBg: "#fff7f0",
    noteBorder: "#dfbca6",
    tape: "#efc9b2",
  },
  混合结果: {
    dot: "bg-[#8b75aa]",
    text: "text-[#644d85]",
    chip: "bg-[#e9e2f2] text-[#644d85] border-[#d0c0e3]",
    labelClass: "bg-[#644d85] text-white",
    noteBg: "#fbf8ff",
    noteBorder: "#d0c0e3",
    tape: "#ddd1ee",
  },
  无解: {
    dot: "bg-[#a3a8a8]",
    text: "text-[#5f6765]",
    chip: "bg-[#edf0ed] text-[#5f6765] border-[#cfd6d0]",
    labelClass: "bg-[#5f6765] text-white",
    noteBg: "#f8f9f6",
    noteBorder: "#cfd6d0",
    tape: "#dde2dc",
  },
};

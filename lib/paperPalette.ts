// 纸条卡片的配色（底色 / 边框）唯一来源。
// 五种纸色对应不同纸张质感：冷白 / 植本 / 暖黄 / 淡紫 / 马尼拉。
// 按索引循环取色：PAPER_COLORS[i % PAPER_COLORS.length]。
export interface PaperColor {
  bg: string;
  border: string;
}

export const PAPER_COLORS: PaperColor[] = [
  { bg: "#eef3f6", border: "#cbd9e1" }, // 冷白纸
  { bg: "#eff5ec", border: "#ccd7c5" }, // 植本纸
  { bg: "#f6efe7", border: "#e0cfbe" }, // 暖黄纸
  { bg: "#f3f0f7", border: "#d6cde0" }, // 淡紫纸
  { bg: "#faf4e2", border: "#e2d6a8" }, // 马尼拉纸
];

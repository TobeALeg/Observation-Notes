// 手绘纸条卡片的配色（底色 / 边框）的唯一来源。
// 用于概念卡片（首页、Glossary）、原则卡片等需要循环上色的地方，
// 按索引取色：PAPER_COLORS[i % PAPER_COLORS.length]。
// 胶带不在这里：内容卡片统一用默认赭黄胶带（globals.css 里 --tape-bg 缺省即 var(--ochre)）。
export interface PaperColor {
  bg: string;
  border: string;
}

export const PAPER_COLORS: PaperColor[] = [
  { bg: "#edf7fb", border: "#abcddd" }, // 矿物蓝
  { bg: "#eef8ea", border: "#bdd8b6" }, // 鼠尾草绿
  { bg: "#fbebe0", border: "#dfbca6" }, // 陶土
  { bg: "#f2eef9", border: "#d0c0e3" }, // 茄紫
  { bg: "#f8edc7", border: "#dfc77a" }, // 赭石
];

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CASE_AREAS, CASE_STATUSES, type CaseArea, type CaseStatus } from "./constants";

export { CASE_AREAS, CASE_STATUSES, type CaseArea, type CaseStatus } from "./constants";

export const CASES_DIR = path.join(process.cwd(), "data", "cases");
export const PRINCIPLES_DIR = path.join(process.cwd(), "data", "principles");
export const GLOSSARY_FILE = path.join(process.cwd(), "docs", "business-concepts.md");

export interface JudgmentCase {
  id: string;
  date: string;
  area: CaseArea | "未分类";
  status: CaseStatus;
  title: string;
  phase: string;
  concepts: string[];
  relatedCases: string[];
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

export interface CaseEdit {
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

export interface Principle {
  id: string;
  title: string;
  sourceCases: string[];
  body: string;
}

function parseSections(body: string): Record<string, string> {
  const out: Record<string, string> = {};
  const parts = body
    .split(/^##\s+/m)
    .map((s) => s.trim())
    .filter(Boolean);
  for (const part of parts) {
    const nl = part.indexOf("\n");
    const heading = (nl === -1 ? part : part.slice(0, nl)).trim();
    const content = (nl === -1 ? "" : part.slice(nl + 1)).trim();
    out[heading] = content;
  }
  return out;
}

function ymd(v: unknown): string {
  if (v instanceof Date) {
    const y = v.getUTCFullYear();
    const m = String(v.getUTCMonth() + 1).padStart(2, "0");
    const d = String(v.getUTCDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  return String(v ?? "").slice(0, 10);
}

function normalizeArea(value: unknown): CaseArea | "未分类" {
  return (CASE_AREAS as readonly string[]).includes(String(value))
    ? (String(value) as CaseArea)
    : "未分类";
}

function normalizeStatus(value: unknown): CaseStatus {
  return (CASE_STATUSES as readonly string[]).includes(String(value))
    ? (String(value) as CaseStatus)
    : "待验证";
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(String).filter(Boolean) : [];
}

function toCase(file: string, raw: string): JudgmentCase {
  const { data, content } = matter(raw);
  const sections = parseSections(content);
  return {
    id: file.replace(/\.md$/, ""),
    date: ymd(data.date),
    area: normalizeArea(data.area),
    status: normalizeStatus(data.status),
    title: String(data.title ?? file.replace(/\.md$/, "")),
    phase: String(data.phase ?? ""),
    concepts: strings(data.concepts),
    relatedCases: strings(data.related_cases),
    scene: sections["场景"] ?? "",
    decisionQuestion: sections["决策问题"] ?? "",
    bossJudgment: sections["老板判断"] ?? "",
    myJudgment: sections["我的判断"] ?? "",
    disagreement: sections["分歧本质"] ?? "",
    validationSignals: sections["验证信号"] ?? "",
    result: sections["结果"] ?? "",
    unresolvedReason: sections["为何无解"] ?? "",
    founderReminder: sections["给未来创业的提醒"] ?? "",
  };
}

export function getAllCases(): JudgmentCase[] {
  if (!fs.existsSync(CASES_DIR)) return [];
  const cases = fs
    .readdirSync(CASES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => toCase(file, fs.readFileSync(path.join(CASES_DIR, file), "utf8")));
  cases.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1
  );
  return cases;
}

export function getCase(id: string): JudgmentCase | undefined {
  return getAllCases().find((item) => item.id === id);
}

export function updateCaseStatus(id: string, status: CaseStatus): boolean {
  const file = path.join(CASES_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return false;
  const parsed = matter(fs.readFileSync(file, "utf8"));
  parsed.data.status = status;
  if (parsed.data.date) parsed.data.date = ymd(parsed.data.date);
  fs.writeFileSync(file, matter.stringify(parsed.content, parsed.data), "utf8");
  return true;
}

export function updateCase(id: string, edit: CaseEdit): boolean {
  const file = path.join(CASES_DIR, `${id}.md`);
  if (!fs.existsSync(file)) return false;
  const parsed = matter(fs.readFileSync(file, "utf8"));
  parsed.data.title = edit.title;
  parsed.data.area = normalizeArea(edit.area);
  if (parsed.data.date) parsed.data.date = ymd(parsed.data.date);
  const body =
    [
      `## 场景\n${edit.scene.trim()}`,
      `## 决策问题\n${edit.decisionQuestion.trim()}`,
      `## 老板判断\n${edit.bossJudgment.trim()}`,
      `## 我的判断\n${edit.myJudgment.trim()}`,
      `## 分歧本质\n${edit.disagreement.trim()}`,
      `## 验证信号\n${edit.validationSignals.trim()}`,
      `## 结果\n${edit.result.trim()}`,
      `## 为何无解\n${edit.unresolvedReason.trim()}`,
      `## 给未来创业的提醒\n${edit.founderReminder.trim()}`,
    ].join("\n\n") + "\n";
  fs.writeFileSync(file, matter.stringify(body, parsed.data), "utf8");
  return true;
}

function toPrinciple(file: string, raw: string): Principle {
  const { data, content } = matter(raw);
  return {
    id: file.replace(/\.md$/, ""),
    title: String(data.title ?? file.replace(/\.md$/, "")),
    sourceCases: strings(data.source_cases),
    body: content.trim(),
  };
}

export function getAllPrinciples(): Principle[] {
  if (!fs.existsSync(PRINCIPLES_DIR)) return [];
  return fs
    .readdirSync(PRINCIPLES_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => toPrinciple(file, fs.readFileSync(path.join(PRINCIPLES_DIR, file), "utf8")))
    .sort((a, b) => a.title.localeCompare(b.title, "zh-CN"));
}

export function getGlossary(): string {
  if (!fs.existsSync(GLOSSARY_FILE)) return "";
  return fs.readFileSync(GLOSSARY_FILE, "utf8");
}

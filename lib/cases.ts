import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { CASE_AREAS, CASE_STATUSES, RECHECK_DAYS, type CaseArea, type CaseStatus } from "./constants";

export { CASE_AREAS, CASE_STATUSES, RECHECK_DAYS, type CaseArea, type CaseStatus } from "./constants";

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
  thesis: string;
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

export interface Principle {
  id: string;
  title: string;
  sourceCases: string[];
  body: string;
}

export interface ConceptEntry {
  title: string;
  focus: string;
  confusion: string;
  usage: string;
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
    thesis: String(data.thesis ?? ""),
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

// 一个 Case 自录入到今天过去了多少天（按 UTC 日期，宽容解析失败）。
export function daysSince(date: string, today: Date = new Date()): number {
  const t = Date.parse(`${date}T00:00:00Z`);
  if (Number.isNaN(t)) return 0;
  const ref = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
  return Math.max(0, Math.floor((ref - t) / 86_400_000));
}

export interface RecheckItem {
  case: JudgmentCase;
  age: number;
}

// 到期复核队列：仍是「待验证」且录入已超过 RECHECK_DAYS 天，最久未回填的排在前面。
export function getRecheckQueue(today: Date = new Date()): RecheckItem[] {
  return getAllCases()
    .filter((item) => item.status === "待验证")
    .map((item) => ({ case: item, age: daysSince(item.date, today) }))
    .filter((entry) => entry.age >= RECHECK_DAYS)
    .sort((a, b) => b.age - a.age);
}

export interface ThesisGroup {
  thesis: string;
  cases: JudgmentCase[];
}

// 按 thesis（根分歧主线）分组，组内 Case 多的排在前面，便于发现反复出现的模式。
export function getThesisGroups(): ThesisGroup[] {
  const map = new Map<string, JudgmentCase[]>();
  for (const item of getAllCases()) {
    if (!item.thesis) continue;
    const list = map.get(item.thesis) ?? [];
    list.push(item);
    map.set(item.thesis, list);
  }
  return [...map.entries()]
    .map(([thesis, cases]) => ({ thesis, cases }))
    .sort((a, b) => b.cases.length - a.cases.length);
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

function cleanConceptLine(text: string): string {
  return text
    .replace(/^\*\*([^*]+)\*\*：?/, "")
    .replace(/\*\*/g, "")
    .trim();
}

function pickConceptField(body: string, label: string): string {
  const line = body
    .split("\n")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`**${label}**`));
  return line ? cleanConceptLine(line) : "";
}

function parseConceptEntries(markdown: string): ConceptEntry[] {
  const firstConcept = markdown.search(/^##\s+/m);
  if (firstConcept === -1) return [];

  return markdown
    .slice(firstConcept)
    .split(/^##\s+/m)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const [title = "", ...bodyLines] = part.split("\n");
      const body = bodyLines.join("\n");
      return {
        title: title.trim(),
        focus: pickConceptField(body, "看点"),
        confusion: pickConceptField(body, "别混淆"),
        usage: pickConceptField(body, "判断用法"),
      };
    })
    .filter((entry) => entry.title)
    .reverse();
}

export function getGlossary(): string {
  if (!fs.existsSync(GLOSSARY_FILE)) return "";
  return fs.readFileSync(GLOSSARY_FILE, "utf8");
}

export function getAllConcepts(): ConceptEntry[] {
  return parseConceptEntries(getGlossary());
}

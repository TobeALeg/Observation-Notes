# Architecture —— 创业判断日志

## Module architecture

技术栈：Next.js 16（App Router）+ TypeScript + Tailwind v4 + gray-matter。无数据库、无后端服务、App 内无 LLM。

```
┌─────────────────────────────────────────────────────────────┐
│  AI 对话（Claude Code / Codex）                              │
│  先拆分候选 Case / Signal / Concept / Reflection，再写文件     │
│  规则见 docs/recording-protocol.md                            │
└─────────────────────────────┬───────────────────────────────┘
                              │ 写 / 回填
                              ▼
     data/cases/*.md      data/principles/*.md      docs/business-concepts.md
     判断分歧 Case         未来创业原则              概念辅助词典
                              │
                              ▼
                         lib/cases.ts
                fs 读写 Case / 读 Principles / 读 Glossary
                              │
              ┌───────────────┴────────────────┐
              ▼                                ▼
      app/ 页面（Server Components）       app/api/cases/...
      · /              Cases 首页          PUT 定稿 Case
      · /case/[id]     Case 详情           PATCH 改 Case 状态
      · /case/[id]/edit 定稿编辑
      · /review        按现实反馈复盘
      · /principles    未来创业原则
      · /glossary      business 概念辅助词典
```

### Module relationship
- `lib/constants.ts`：Case 领域和六个状态。无 Node 依赖，客户端组件可引用。
- `lib/cases.ts`：仅服务端使用，负责读取 `data/cases/`、`data/principles/` 和 `docs/business-concepts.md`，以及写回 Case 正文和状态。
- `components/CaseCard.tsx`：Case 列表卡片，突出决策问题和分歧。
- `components/StatusChanger.tsx`：客户端组件，调用 `PATCH /api/cases/[id]/status` 乐观更新状态。
- `components/CaseEditor.tsx`：客户端定稿表单，调用 `PUT /api/cases/[id]`。
- `components/Markdown.tsx`：统一渲染 markdown；旧 `[[概念]]` 写法只跳到 `/glossary`，不再创建概念详情页。

### Data flow
- **写**：AI 根据记录协议直接创建或更新 `data/cases/*.md`；概念补到 `docs/business-concepts.md`；原则补到 `data/principles/*.md`。
- **读**：页面请求时通过 `fs` 读取 markdown，页面使用 `export const dynamic = "force-dynamic"` 保证看到最新文件。
- **定稿**：Case 编辑页 → `PUT /api/cases/[id]` → `updateCase()` 写回正文。
- **改状态**：详情页状态按钮 → `PATCH /api/cases/[id]/status` → `updateCaseStatus()` 改 frontmatter → `router.refresh()`。

### Status flow

```
待验证
 ├─ 现实证明我的判断更接近 ─────▶ 我更接近
 ├─ 现实证明老板判断更接近 ─────▶ 老板更接近
 ├─ 双方关键假设都失败 ─────────▶ 双方都错
 ├─ 部分判断成立、部分不成立 ───▶ 混合结果
 └─ 信号不足或条件变化无法裁判 ─▶ 无解（必须写为何无解）
```

状态是判断校准，不是任务进度。

## 数据格式

### Case

文件：`data/cases/YYYY-MM-DD-简短标题.md`

```markdown
---
date: 2026-06-15
area: 产品化
status: 待验证
phase: 探索期（选 wedge，验证 GTM）
concepts:
  - GTM
related_cases:
  - 2026-06-15-另一个case
title: 一句话 Case 标题
---

## 场景

## 决策问题

## 老板判断

## 我的判断

## 分歧本质

## 验证信号

## 结果

## 为何无解

## 给未来创业的提醒
```

### Principle

文件：`data/principles/<slug>.md`

```markdown
---
title: 不要用 pitch 的完成感替代真实验证
source_cases:
  - 2026-06-15-pitch先行能推进gtm
---

原则正文。
```

### Glossary

文件：`docs/business-concepts.md`

只记录对 Case 有帮助的 business / marketing 概念解释，不维护互链网络。

## 取舍记录
- **用 markdown 而不是数据库**：AI agent 写文件最自然；内容可读、可 git、可被人直接改。
- **Case 替代 Observation / Thread / Concept**：旧模型容易长成知识库；新模型以可验证判断问题为中心。
- **Glossary 放在 docs**：概念有价值，但不是产品主线。
- **保留旧数据目录**：`data/observations/`、`data/threads/`、`data/concepts/` 作为历史原始材料保留，当前 App 不读取。
- **无解是正式状态**：避免把复杂商业判断强行裁判成谁对谁错。

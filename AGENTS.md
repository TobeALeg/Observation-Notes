# 创业判断日志 ObservationNotes

一个**创业判断校准系统**：把在 pre-startup / AI 咨询公司里经历的真实分歧，转化成未来创业可用的判断力。不是聊天记录库，不是 Obsidian，不是情绪日记。

## 这个项目怎么运转（重要）

```
用户跟 AI（Claude Code / Codex）发一段复杂对话或工作现场
   ↓
AI 先拆分候选 Case / Signal / Concept / Reflection
   ↓
用户确认要记录哪些 Case
   ↓
AI 写入 data/cases/*.md；概念只补 docs/business-concepts.md
   ↓
GitHub Pages（Next.js 静态导出）= 浏览 + 复盘发布快照
   Cases / Review / Principles / Glossary
```

**AI 那部分发生在对话里，App 里不接任何 LLM。** 每个 Case 是一个 markdown 文件，人能读、能进 git，两个 agent 都能写。

### 当用户发来一段观察或复杂对话 → 严格按 [`docs/recording-protocol.md`](docs/recording-protocol.md) 操作

先拆分，不要急着写文件。Case 不是一次对话，而是一个可被现实验证的判断问题。

## 架构与产品文档

- 产品定义：[`docs/product.md`](docs/product.md)
- 架构说明：[`docs/architecture.md`](docs/architecture.md)

## 关键约定

- 数据主线：`data/cases/*.md`，schema 见 recording-protocol。
- 原则：`data/principles/*.md`，只记录从多个 Case 里提炼出的未来创业提醒。
- 概念：`docs/business-concepts.md`，只是辅助词典，不做知识库、不做双链。
- 历史原始材料：`data/observations/`、`data/threads/`、`data/concepts/` 暂时保留，但当前 App 不读取。
- 常量（7 领域 / 6 状态）的唯一来源：`lib/constants.ts`（无 Node 依赖，客户端也能引）。
- 读取 markdown 的逻辑都在 `lib/cases.ts`（含 `fs`，只在构建时运行）。
- GitHub Pages 是只读快照；Case 新建、定稿和状态回填都直接修改 markdown，再通过 Git 发布。
- `app/case/[id]/page.tsx` 用 `generateStaticParams()` 在构建时生成所有详情页。
- `.github/workflows/deploy-pages.yml` 在 `main` 更新后构建并发布 `out/`。
- 改 `app/globals.css` 的 `@theme` 新增颜色后，必须 `rm -rf .next && npm run dev`，否则新工具类（如 `bg-primary`）不生成。
- 本地运行：`npm run dev` → http://localhost:3000
- 静态构建：`npm run build` → `out/`

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

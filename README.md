# 创业判断日志

把真实工作现场里的判断分歧沉淀成可被现实验证的 Case，长期校准自己的 founder judgment。

在线阅读：<https://tobealeg.github.io/Observation-Notes/>

## 数据与发布边界

- `data/cases/*.md` 是 Case 正本。
- `data/principles/*.md` 只保存从多个 Case 提炼出的原则。
- `docs/business-concepts.md` 是辅助判断的概念词典。
- AI/Codex 按 `docs/recording-protocol.md` 创建和回填内容。
- GitHub Pages 是只读发布快照，不在浏览器里修改仓库数据。

## 本地运行

```bash
npm install
npm run dev
```

访问 <http://localhost:3000>。

## 构建静态站点

```bash
npm run build
npm run preview
```

静态文件输出到 `out/`。推送到 `main` 后，GitHub Actions 会自动构建并发布 GitHub Pages。

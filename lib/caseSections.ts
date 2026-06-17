// Case 的 9 个内容字段的唯一定义（key / 标题 / 提示）。
// 详情页 app/case/[id]/page.tsx 与编辑器 components/CaseEditor.tsx 都引用这里，
// 避免两处各写一份导致文案漂移。
export const CASE_SECTIONS = [
  { key: "scene", label: "场景", hint: "发生了什么，约束是什么" },
  { key: "decisionQuestion", label: "决策问题", hint: "真正要判断的问题" },
  { key: "bossJudgment", label: "老板判断", hint: "他的选择和底层假设" },
  { key: "myJudgment", label: "我的判断", hint: "你的判断和底层假设" },
  { key: "disagreement", label: "分歧本质", hint: "差在目标、阶段、风险还是假设" },
  { key: "validationSignals", label: "验证信号", hint: "未来看哪些现实反馈" },
  { key: "result", label: "结果", hint: "发生了什么，谁更接近现实" },
  { key: "unresolvedReason", label: "为何无解", hint: "状态为无解时必须解释；否则可留空" },
  { key: "founderReminder", label: "给未来创业的提醒", hint: "这条 Case 最终要留下的东西" },
] as const;

export type CaseSectionKey = (typeof CASE_SECTIONS)[number]["key"];

export const CASE_AREAS = [
  "战略方向",
  "产品化",
  "客户与市场",
  "GTM与销售",
  "组织执行",
  "创始人决策",
  "自我校准",
] as const;

export const CASE_STATUSES = [
  "待验证",
  "我更接近",
  "老板更接近",
  "双方都错",
  "混合结果",
  "无解",
] as const;

export type CaseArea = (typeof CASE_AREAS)[number];
export type CaseStatus = (typeof CASE_STATUSES)[number];

// 待验证 Case 超过这么多天未回填，自动进入「到期复核」队列。
export const RECHECK_DAYS = 14;

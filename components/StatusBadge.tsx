import type { CaseStatus } from "@/lib/constants";
import { STATUS_STYLE } from "@/lib/statusStyle";

export default function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

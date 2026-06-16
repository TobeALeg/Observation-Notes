import type { CaseStatus } from "@/lib/constants";

export const STATUS_STYLE: Record<
  CaseStatus,
  { dot: string; text: string; chip: string; bar: string }
> = {
  待验证: {
    dot: "bg-[#6fa7c0]",
    text: "text-[#35677d]",
    chip: "bg-[#dcecf4] text-[#2f6176] border-[#b8d4df]",
    bar: "border-l-[#6fa7c0]",
  },
  我更接近: {
    dot: "bg-[#6ca36f]",
    text: "text-[#47764a]",
    chip: "bg-[#e4efdf] text-[#3f7143] border-[#bdd8b6]",
    bar: "border-l-[#6ca36f]",
  },
  老板更接近: {
    dot: "bg-[#6f83aa]",
    text: "text-[#4d638d]",
    chip: "bg-[#e1e7f2] text-[#445c87] border-[#bdc8de]",
    bar: "border-l-[#6f83aa]",
  },
  双方都错: {
    dot: "bg-[#be684f]",
    text: "text-[#944c3a]",
    chip: "bg-[#f3dfcf] text-[#884631] border-[#dfbca6]",
    bar: "border-l-[#be684f]",
  },
  混合结果: {
    dot: "bg-[#8b75aa]",
    text: "text-[#6b568a]",
    chip: "bg-[#e9e2f2] text-[#644d85] border-[#d0c0e3]",
    bar: "border-l-[#8b75aa]",
  },
  无解: {
    dot: "bg-[#a3a8a8]",
    text: "text-[#686f6f]",
    chip: "bg-[#edf0ed] text-[#5f6765] border-[#cfd6d0]",
    bar: "border-l-[#a3a8a8]",
  },
};

export default function StatusBadge({ status }: { status: CaseStatus }) {
  const s = STATUS_STYLE[status];
  return (
    <span className={`inline-flex items-center gap-1.5 ${s.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

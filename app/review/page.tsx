import CaseCard from "@/components/CaseCard";
import Tape from "@/components/Tape";
import PageContainer from "@/components/PageContainer";
import { STATUS_STYLE } from "@/lib/statusStyle";
import { CASE_STATUSES } from "@/lib/constants";
import { getAllCases } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const cases = getAllCases();

  return (
    <PageContainer width="wide">
      <header className="mb-8">
        <h1 className="mb-2 font-serif text-3xl font-semibold tracking-tight">
复盘
        </h1>
        <p className="text-sm leading-7 text-muted">
          按现实反馈扫描判断：哪些还没验证，哪些证明我更接近，哪些说明老板看到了我没看到的东西。
        </p>
      </header>

      <div className="grid gap-x-8 gap-y-9 lg:grid-cols-2">
        {CASE_STATUSES.map((status) => {
          const items = cases.filter((item) => item.status === status);
          const style = STATUS_STYLE[status];
          return (
            <section key={status}>
              <div className="mb-4 flex items-center gap-3">
                <Tape label={status} color={style.tape} />
                <span className="text-xs text-muted">{items.length}</span>
              </div>
              {items.length === 0 ? (
                <p className="sketch-control bg-card px-4 py-6 text-center text-xs text-muted">
                  暂无
                </p>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <CaseCard key={item.id} item={item} />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </PageContainer>
  );
}

import Link from "next/link";
import CaseCard from "@/components/CaseCard";
import StatusBadge from "@/components/StatusBadge";
import Tape from "@/components/Tape";
import PageContainer from "@/components/PageContainer";
import { STATUS_STYLE } from "@/lib/statusStyle";
import { CASE_STATUSES, RECHECK_DAYS } from "@/lib/constants";
import { getAllCases, getRecheckQueue, getThesisGroups } from "@/lib/cases";

export const dynamic = "force-dynamic";

export default async function ReviewPage() {
  const cases = getAllCases();
  const recheck = getRecheckQueue();
  const theses = getThesisGroups();

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

      <section className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <Tape label="到期复核" color="#e7b4a6" />
          <span className="text-xs text-muted">
            待验证超过 {RECHECK_DAYS} 天 · {recheck.length}
          </span>
        </div>
        {recheck.length === 0 ? (
          <p className="sketch-control bg-card px-4 py-6 text-center text-xs text-muted">
            暂无到期 Case。待验证的判断会在 {RECHECK_DAYS} 天后自动出现在这里，提醒你回填现实结果。
          </p>
        ) : (
          <div className="space-y-2.5">
            {recheck.map(({ case: item, age }) => (
              <Link
                key={item.id}
                href={`/case/${encodeURIComponent(item.id)}`}
                className="sketch-control flex items-center gap-4 bg-card px-4 py-3 transition-colors hover:border-primary"
              >
                <span className="font-mono text-xs text-muted">{item.date}</span>
                <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-foreground">
                  {item.title}
                </span>
                {item.thesis && (
                  <span className="hidden shrink-0 text-xs text-muted sm:inline">
                    {item.thesis}
                  </span>
                )}
                <span className="shrink-0 rounded-md bg-clay px-2 py-0.5 text-xs text-primary">
                  {age} 天未回填
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

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
                    <CaseCard key={item.id} item={item} variant="tab" />
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {theses.length > 0 && (
        <section className="mt-12 border-t border-border pt-9">
          <div className="mb-4 flex items-center gap-3">
            <Tape label="判断主线" color="#cdb4db" />
            <span className="text-xs text-muted">
              同一根分歧反复出现的地方，就是该提炼原则的地方
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {theses.map((group) => {
              const ripe = group.cases.length >= 3;
              return (
                <article key={group.thesis} className="sketch-control bg-card px-5 py-4">
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <h2 className="font-serif text-base font-semibold text-foreground">
                      {group.thesis}
                    </h2>
                    <span className="shrink-0 text-xs text-muted">
                      {group.cases.length} 个 Case
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {group.cases.map((item) => (
                      <Link
                        key={item.id}
                        href={`/case/${encodeURIComponent(item.id)}`}
                        className="flex items-center gap-2 text-[13px] text-foreground/80 transition-colors hover:text-foreground"
                      >
                        <span className={`h-2 w-2 shrink-0 rounded-full ${STATUS_STYLE[item.status].dot}`} />
                        <span className="min-w-0 flex-1 truncate">{item.title}</span>
                        <span className="shrink-0">
                          <StatusBadge status={item.status} />
                        </span>
                      </Link>
                    ))}
                  </div>
                  {ripe && (
                    <p className="mt-3 rounded-md bg-sage px-3 py-1.5 text-xs text-foreground/70">
                      已积累 {group.cases.length} 个 Case — 可考虑提炼成一条原则。
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        </section>
      )}
    </PageContainer>
  );
}

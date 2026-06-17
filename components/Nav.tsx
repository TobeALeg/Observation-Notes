"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/", label: "判断分歧" },
  { href: "/glossary", label: "概念提醒" },
  { href: "/review", label: "复盘" },
  { href: "/principles", label: "原则" },
];

export default function Nav() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur-md sketch-rule">
      <div className="mx-auto flex h-[68px] max-w-[1512px] items-center gap-8 px-6 md:px-8">
        <Link href="/" className="flex items-center gap-4 shrink-0">
          <span className="sketch-logo" aria-hidden />
          <span className="font-serif text-xl font-semibold tracking-tight">
            创业判断日志
          </span>
        </Link>
        <nav className="hidden h-full items-center gap-10 text-[15px] font-medium md:flex">
          {TABS.map((tab) => {
            const active =
              tab.href === "/"
                ? pathname === "/" || pathname.startsWith("/case")
                : pathname.startsWith(tab.href);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`relative flex h-full items-center px-1 transition-colors ${
                  active
                    ? "text-foreground after:absolute after:bottom-2 after:left-0 after:h-0.5 after:w-full after:rotate-[-1deg] after:rounded-full after:bg-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto hidden items-center gap-5 lg:flex">
          <label className="sketch-control flex h-10 w-[300px] items-center gap-3 bg-card/80 px-4 text-sm text-muted">
            <span className="text-base leading-none">⌕</span>
            <input
              className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted"
              placeholder="搜索 Case / 概念 / 关键词"
              type="search"
            />
            <span className="sketch-control bg-foreground/[0.06] px-1.5 py-0.5 text-xs text-muted">
              ⌘K
            </span>
          </label>
          <span className="sketch-chip grid h-10 w-10 place-items-center bg-avatar font-serif text-sm text-foreground">
            D
          </span>
        </div>
      </div>
    </header>
  );
}

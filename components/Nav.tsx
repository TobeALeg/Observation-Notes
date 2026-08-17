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
      <div className="mx-auto flex h-[68px] max-w-[1512px] items-center gap-5 px-4 md:gap-8 md:px-8">
        <Link href="/" className="flex items-center gap-4 shrink-0">
          <span className="sketch-logo" aria-hidden />
          <span className="hidden font-serif text-xl font-semibold tracking-tight sm:inline">
            创业判断日志
          </span>
        </Link>
        <nav className="flex h-full min-w-0 flex-1 items-center gap-5 overflow-x-auto text-sm font-medium md:gap-10 md:text-[15px]">
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
        <div className="ml-auto hidden shrink-0 items-center gap-3 lg:flex">
          <span className="sketch-chip bg-card px-3 py-1.5 text-xs text-muted">
            GitHub Pages · 只读
          </span>
          <a
            href="https://github.com/TobeALeg/Observation-Notes"
            target="_blank"
            rel="noopener noreferrer"
            className="sketch-control bg-card px-4 py-2 text-sm text-foreground transition-colors hover:border-primary"
          >
            源码 ↗
          </a>
        </div>
      </div>
    </header>
  );
}

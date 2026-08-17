"use client";

import { useRouter } from "next/navigation";

export default function BackLink({
  fallbackHref = "/",
  children = "← 返回上页",
  className = "text-sm text-muted hover:text-foreground",
}: {
  fallbackHref?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const router = useRouter();

  function goBack() {
    if (window.history.length > 1) {
      router.back();
      return;
    }
    router.push(fallbackHref);
  }

  return (
    <button type="button" onClick={goBack} className={className}>
      {children}
    </button>
  );
}

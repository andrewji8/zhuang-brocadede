"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart";

const NAV = [
  { label: "首页", href: "/" },
  { label: "商店", href: "/shop" },
  { label: "系列", href: "/collections" },
  { label: "关于", href: "/about" },
  { label: "日志", href: "/journal" },
];

export function Header() {
  const pathname = usePathname();
  const { count, setOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-2xl tracking-wide text-primary">
          ZHUAJIN<span className="ml-2 text-sm tracking-normal text-mute">壮锦</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`text-sm transition-colors ${
                  active ? "text-ink font-medium" : "text-mute hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => setOpen(true)}
          className="relative rounded-pill border border-line bg-surface px-4 py-2 text-sm text-ink"
        >
          购物车
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs text-surface">
              {count}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

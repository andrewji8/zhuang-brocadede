"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { ProductArt } from "./product-art";
import type { Product } from "@/data/products";

export type CartItem = {
  product: Product;
  color: string;
  size: string;
  qty: number;
};

type Toast = { msg: string; id: number } | null;

type CartCtx = {
  items: CartItem[];
  add: (p: Product, color?: string, size?: string, qty?: number) => void;
  remove: (i: number) => void;
  setQty: (i: number, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  toast: Toast;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "yunsi-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  // 初始值两端都为空，保证 SSR 与客户端首 render 一致（避免 hydration 不匹配）；
  // 真实购物车数据在 mount 后再从 localStorage 恢复。
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [restored, setRestored] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 加购时不再自动打开抽屉，改用轻量 toast 提示（不弹完整清单）。
  const showToast = useCallback((msg: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, id: Date.now() });
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }, []);

  // mount 后恢复购物车（仅客户端执行）。
  // 这是 React 官方推荐的 SSR/localStorage 恢复模式：把外部系统状态同步进 React state。
  // 用 requestAnimationFrame 延迟一帧执行，使首帧渲染（与 SSR 一致的空购物车）先完成，
  // 再切换数据，既保证水合一致，也避免在 effect 体里同步 setState 触发级联渲染告警。
  useEffect(() => {
    const restore = () => {
      try {
        const raw = localStorage.getItem(KEY);
        if (raw) setItems(JSON.parse(raw) as CartItem[]);
      } catch {
        /* ignore */
      }
      setRestored(true);
    };
    const raf = requestAnimationFrame(restore);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 仅在恢复完成后才写回 localStorage，避免用初始空值覆盖用户真实购物车
  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items, restored]);

  const add = useCallback(
    (p: Product, color?: string, size?: string, qty = 1) => {
      const c = color ?? p.colors[0];
      const s = size ?? p.sizes[0];
      setItems((prev) => {
        const idx = prev.findIndex(
          (it) => it.product.slug === p.slug && it.color === c && it.size === s
        );
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: next[idx].qty + qty };
          return next;
        }
        return [...prev, { product: p, color: c, size: s, qty }];
      });
      showToast(`已加入购物车：${p.name}`);
    },
    [showToast]
  );

  const remove = useCallback((i: number) => {
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const setQty = useCallback((i: number, qty: number) => {
    setItems((prev) =>
      prev.map((it, idx) => (idx === i ? { ...it, qty: Math.max(1, qty) } : it))
    );
  }, []);

  const clear = useCallback(() => {
    setItems([]);
    showToast("已清空购物车");
  }, [showToast]);

  const value = useMemo<CartCtx>(() => {
    const count = items.reduce((n, it) => n + it.qty, 0);
    const subtotal = items.reduce(
      (n, it) => n + it.product.priceCny * it.qty,
      0
    );
    return { items, add, remove, setQty, clear, count, subtotal, open, setOpen, toast };
  }, [items, add, remove, setQty, clear, open, toast]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export function CartDrawer() {
  const { items, setQty, remove, clear, subtotal, count, open, setOpen, toast } =
    useCart();
  const router = useRouter();
  const goCheckout = () => {
    setOpen(false);
    router.push("/checkout");
  };
  return (
    <>
      <aside
        className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}
        aria-hidden={!open}
      >
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/30 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-surface shadow-2xl transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-6 py-5">
            <h2 className="font-display text-2xl text-primary">
              购物车
              <span className="ml-2 text-sm text-mute">（{count}）</span>
            </h2>
            <div className="flex items-center gap-3">
              {items.length > 0 && (
                <button
                  onClick={clear}
                  className="text-xs text-mute underline hover:text-ink"
                >
                  清空
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="rounded-pill border border-line px-4 py-1.5 text-sm text-mute hover:text-ink"
              >
                关闭
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <p className="py-16 text-center text-mute">购物车还是空的</p>
            ) : (
              <ul className="space-y-5">
                {items.map((it, i) => (
                  <li key={i} className="flex gap-4">
                    <div className="h-20 w-16 shrink-0 overflow-hidden rounded-img bg-line">
                      <ProductArt
                        slug={it.product.slug}
                        color={it.color}
                        label={it.product.altText}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-ink">{it.product.name}</p>
                      <p className="text-xs text-mute">
                        {it.color} / {it.size}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          onClick={() => setQty(i, it.qty - 1)}
                          className="h-7 w-7 rounded-full border border-line text-mute"
                        >
                          −
                        </button>
                        <span className="text-sm">{it.qty}</span>
                        <button
                          onClick={() => setQty(i, it.qty + 1)}
                          className="h-7 w-7 rounded-full border border-line text-mute"
                        >
                          +
                        </button>
                        <button
                          onClick={() => remove(i)}
                          className="ml-auto text-xs text-mute underline hover:text-ink"
                        >
                          移除
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-primary">
                      ¥{it.product.priceCny * it.qty}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="border-t border-line px-6 py-5">
            <div className="mb-3 flex items-center justify-between text-lg">
              <span className="text-mute">小计</span>
              <span className="font-display text-primary">¥{subtotal}</span>
            </div>
            <button
              disabled={items.length === 0}
              onClick={goCheckout}
              className="w-full rounded-pill bg-primary py-3 text-sm font-medium text-surface disabled:opacity-40"
            >
              去结算（支付宝 / 微信）
            </button>
            <p className="mt-2 text-center text-xs text-mute">
              支持支付宝 · 微信支付，90 天无理由
            </p>
          </div>
        </div>
      </aside>

      {/* 轻量加购提示（自动消失，不弹完整清单） */}
      <div
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <button
          onClick={() => toast && setOpen(true)}
          className="flex items-center gap-3 rounded-pill bg-ink/90 px-5 py-3 text-sm text-surface shadow-lg backdrop-blur"
        >
          <span>{toast?.msg}</span>
          <span className="text-xs text-surface/70 underline">查看购物车</span>
        </button>
      </div>
    </>
  );
}

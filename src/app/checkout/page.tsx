"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart, type CartItem } from "@/components/cart";
import { MockQR } from "@/components/mock-qr";

type Channel = "alipay" | "wechat";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clear, setOpen } = useCart();
  const [channel, setChannel] = useState<Channel>("alipay");
  const [order, setOrder] = useState<{
    orderId: string;
    mode: string;
    action: string;
    qrCodeContent: string;
    totalCny: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [paying, setPaying] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // 空购物车且没有待支付订单 → 回商店
  useEffect(() => {
    if (items.length === 0 && !order && !done) router.replace("/shop");
  }, [items.length, order, done, router]);

  const payItems = useMemo(
    () =>
      (items as CartItem[]).map((it) => ({
        slug: it.product.slug,
        name: it.product.name,
        color: it.color,
        size: it.size,
        qty: it.qty,
        unitPriceCny: it.product.priceCny,
      })),
    [items]
  );

  async function startCheckout() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: payItems, channel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "checkout failed");
      setOrder(data);
      setOpen(false);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "checkout failed");
    } finally {
      setBusy(false);
    }
  }

  async function simulatePaid() {
    if (!order) return;
    setPaying(true);
    const notifyUrl =
      channel === "wechat"
        ? "/api/pay/notify-wechat"
        : "/api/pay/notify-alipay";
    try {
      await fetch(notifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.orderId }),
      });
      setDone(true);
      clear();
    } finally {
      setPaying(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-4xl text-primary">结算</h1>

      {items.length === 0 && !order && (
        <p className="mt-6 text-mute">购物车为空，先去挑几件壮锦。</p>
      )}

      {/* 商品清单 */}
      {(items.length > 0 || order) && (
        <section className="mt-8 rounded-card bg-surface p-6">
          <h2 className="font-display text-xl text-ink">待支付商品</h2>
          <ul className="mt-4 divide-y divide-line">
            {items.length > 0
              ? items.map((it, i) => (
                  <li key={i} className="flex justify-between py-3 text-sm">
                    <span>
                      {it.product.name}
                      <span className="ml-2 text-mute">
                        {it.color} / {it.size} × {it.qty}
                      </span>
                    </span>
                    <span className="text-ink">¥{it.product.priceCny * it.qty}</span>
                  </li>
                ))
              : order && (
                  <li className="py-3 text-sm text-mute">
                    订单 {order.orderId} · 共 ¥{order.totalCny}
                  </li>
                )}
          </ul>
          <div className="mt-4 flex justify-between border-t border-line pt-4">
            <span className="text-mute">合计</span>
            <span className="font-display text-2xl text-primary">
              ¥{order ? order.totalCny : subtotal}
            </span>
          </div>
        </section>
      )}

      {/* 支付方式选择（未生成订单时） */}
      {!order && items.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-xl text-ink">选择支付方式</h2>
          <div className="mt-4 flex gap-4">
            {(
              [
                { id: "alipay", label: "支付宝", desc: "扫码 / 跳转收银台" },
                { id: "wechat", label: "微信支付", desc: "扫码支付" },
              ] as { id: Channel; label: string; desc: string }[]
            ).map((c) => (
              <button
                key={c.id}
                onClick={() => setChannel(c.id)}
                className={`flex-1 rounded-card border p-5 text-left transition-colors ${
                  channel === c.id
                    ? "border-primary bg-primary/5"
                    : "border-line bg-surface"
                }`}
              >
                <p className="font-medium text-ink">{c.label}</p>
                <p className="mt-1 text-xs text-mute">{c.desc}</p>
              </button>
            ))}
          </div>
          {err && <p className="mt-4 text-sm text-[#b44]">{err}</p>}
          <button
            onClick={startCheckout}
            disabled={busy}
            className="mt-6 w-full rounded-pill bg-primary py-3.5 text-sm font-medium text-surface disabled:opacity-50"
          >
            {busy ? "生成订单中…" : "确认订单并生成支付码"}
          </button>
        </section>
      )}

      {/* 支付码 + 模拟成功 */}
      {order && (
        <section className="mt-8 rounded-card bg-surface p-6 text-center">
          {done ? (
            <div className="py-6">
              <p className="font-display text-3xl text-primary">✓ 支付成功</p>
              <p className="mt-3 text-mute">
                订单 {order.orderId} 已支付（本地 mock 模式：{order.mode}）
              </p>
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={() => router.push(`/order/${order.orderId}`)}
                  className="rounded-pill bg-primary px-6 py-3 text-sm text-surface"
                >
                  查看订单
                </button>
                <button
                  onClick={() => router.push("/shop")}
                  className="rounded-pill border border-line px-6 py-3 text-sm text-ink"
                >
                  继续购物
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm text-mute">
                使用 {channel === "wechat" ? "微信" : "支付宝"} 扫码（本地模拟）
              </p>
              <div className="my-6">
                <MockQR content={order.qrCodeContent} />
              </div>
              <button
                onClick={simulatePaid}
                disabled={paying}
                className="w-full rounded-pill bg-primary py-3.5 text-sm font-medium text-surface disabled:opacity-50"
              >
                {paying ? "通知中…" : "模拟扫码支付成功"}
              </button>
            </>
          )}
        </section>
      )}

      <p className="mt-8 text-center text-xs text-mute">
        当前 PAYMENT_MODE = mock（本地测试）。接入支付宝 / 微信正式密钥后，
        将 .env 的 PAYMENT_MODE 改为 alipay 或 wechat 即可切换真实支付。
      </p>
    </div>
  );
}

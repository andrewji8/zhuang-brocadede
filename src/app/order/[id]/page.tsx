"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  items: { name: string; color: string; size: string; qty: number; unitPriceCny: number }[];
  totalCny: number;
  status: string;
  channel: string | null;
  createdAt: string;
  paidAt?: string;
};

const STATUS_LABEL: Record<string, string> = {
  pending: "待支付",
  paid: "已支付",
  shipped: "已发货",
  delivered: "已送达",
  refunded: "已退款",
  closed: "已关闭",
};

export default function OrderPage() {
  const params = useParams();
  const id = String(params?.id ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/order/${id}`)
      .then(async (r) => {
        if (!r.ok) {
          setNotFound(true);
          return;
        }
        setOrder(await r.json());
      })
      .catch(() => setNotFound(true));
  }, [id]);

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="font-display text-2xl text-ink">未找到该订单</p>
        <p className="mt-2 text-mute">订单号 {id || "未知"} 不存在。</p>
        <Link href="/shop" className="mt-8 inline-block rounded-pill bg-primary px-6 py-3 text-sm text-surface">
          回商店
        </Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mx-auto max-w-2xl px-6 py-24 text-center text-mute">加载订单中…</div>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="text-xs tracking-widest text-mute">订单</p>
      <h1 className="mt-2 font-display text-3xl text-ink">{order.id}</h1>

      <div className="mt-4 inline-flex items-center gap-2 rounded-pill bg-surface px-4 py-2 text-sm">
        <span className="h-2 w-2 rounded-full bg-primary" />
        <span className="text-ink">{STATUS_LABEL[order.status] ?? order.status}</span>
        {order.channel && <span className="text-mute">· {order.channel === "wechat" ? "微信支付" : "支付宝"}</span>}
      </div>

      <section className="mt-8 rounded-card bg-surface p-6">
        <h2 className="font-display text-lg text-ink">商品</h2>
        <ul className="mt-4 divide-y divide-line">
          {order.items.map((it, i) => (
            <li key={i} className="flex justify-between py-3 text-sm">
              <span>
                {it.name}
                <span className="ml-2 text-mute">
                  {it.color} / {it.size} × {it.qty}
                </span>
              </span>
              <span className="text-ink">¥{it.unitPriceCny * it.qty}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between border-t border-line pt-4">
          <span className="text-mute">合计</span>
          <span className="font-display text-xl text-primary">¥{order.totalCny}</span>
        </div>
      </section>

      <section className="mt-6 rounded-card bg-surface p-6 text-sm text-mute">
        <p>下单时间：{new Date(order.createdAt).toLocaleString("zh-CN")}</p>
        {order.paidAt && <p>支付时间：{new Date(order.paidAt).toLocaleString("zh-CN")}</p>}
        {order.customerName && <p>收件人：{order.customerName}</p>}
        {order.customerEmail && <p>联系邮箱：{order.customerEmail}</p>}
      </section>

      <div className="mt-8 flex gap-4">
        <Link href="/shop" className="rounded-pill bg-primary px-6 py-3 text-sm text-surface">
          继续购物
        </Link>
        <Link href="/" className="rounded-pill border border-line px-6 py-3 text-sm text-ink">
          回首页
        </Link>
      </div>
    </div>
  );
}

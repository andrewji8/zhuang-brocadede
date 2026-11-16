import { NextResponse } from "next/server";
import { createOrder, updateOrderStatus } from "@/lib/orders";
import { getPayAdapter, PAY_MODE } from "@/lib/pay";
import type { PayChannel, PayItem } from "@/lib/pay/types";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const items: PayItem[] = Array.isArray(body.items) ? body.items : [];
    if (items.length === 0) {
      return NextResponse.json({ error: "empty-cart" }, { status: 400 });
    }

    const channel: PayChannel = body.channel === "wechat" ? "wechat" : "alipay";
    const customerEmail = typeof body.email === "string" ? body.email : undefined;
    const customerName = typeof body.name === "string" ? body.name : undefined;

    const totalCny = items.reduce((sum, it) => sum + it.unitPriceCny * it.qty, 0);

    const order = await createOrder({ items, totalCny, customerEmail, customerName });
    // 持久化所选渠道（createOrder 固定写 null）
    const withChannel = await updateOrderStatus(order.id, "pending", channel);

    const adapter = getPayAdapter(channel);
    const intent = await adapter.createIntent(withChannel ?? order);

    return NextResponse.json({
      orderId: order.id,
      mode: PAY_MODE,
      channel,
      action: intent.action,
      qrCodeContent: intent.qrCodeContent,
      totalCny,
    });
  } catch (e) {
    console.error("checkout error:", e);
    return NextResponse.json({ error: "server-error" }, { status: 500 });
  }
}

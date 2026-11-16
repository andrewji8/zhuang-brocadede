import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";
import { getPayAdapter } from "@/lib/pay";

export const dynamic = "force-dynamic";

/**
 * 支付宝回调（本地测试用）。生产：支付宝服务端 POST 到此 URL，
 * 必须用 AlipaySdk.checkNotifySign 验签 + 仅 TRADE_SUCCESS/FINISHED 时更新。
 * 本地 mock：带 orderId 即模拟支付成功。
 */
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    // 兼容 JSON 或 form 两种报文
    let params: Record<string, string | undefined> = {};
    try {
      params = JSON.parse(raw || "{}");
    } catch {
      params = Object.fromEntries(new URLSearchParams(raw));
    }

    const adapter = getPayAdapter("alipay");
    const result = await adapter.handleNotify(params);

    if (result.orderId) {
      const updated = await updateOrderStatus(result.orderId, "paid", "alipay");
      if (!updated) {
        return NextResponse.json({ error: "order-not-found" }, { status: 404 });
      }
    }

    // 支付宝要求返回纯文本 success 以停止重发
    return new Response("success", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (e) {
    console.error("alipay notify error:", e);
    return new Response("fail", {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
      status: 500,
    });
  }
}

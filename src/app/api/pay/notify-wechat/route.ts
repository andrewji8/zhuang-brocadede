import { NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";
import { getPayAdapter } from "@/lib/pay";

export const dynamic = "force-dynamic";

/**
 * 微信支付 v3 回调（本地测试用）。生产：需 Wechatpay-Signature 验签 +
 * AES-256-GCM 解密 resource，仅 trade_state=SUCCESS 时更新，并返回 {code:"SUCCESS"}。
 * 本地 mock：带 orderId 即模拟支付成功。
 */
export async function POST(req: Request) {
  try {
    const raw = await req.text();
    let params: Record<string, string | undefined> = {};
    try {
      const json = JSON.parse(raw || "{}");
      params = {
        // 兼容：mock 顶层 orderId / 真实报文 resource 解密后的 out_trade_no
        orderId:
          json.orderId ??
          json.out_trade_no ??
          json.resource?.original_message?.out_trade_no,
        out_trade_no:
          json.out_trade_no ?? json.resource?.original_message?.out_trade_no,
      };
    } catch {
      params = Object.fromEntries(new URLSearchParams(raw));
    }

    const adapter = getPayAdapter("wechat");
    const result = await adapter.handleNotify(params);

    if (result.orderId) {
      const updated = await updateOrderStatus(result.orderId, "paid", "wechat");
      if (!updated) {
        return NextResponse.json({ code: "FAIL", message: "order-not-found" }, { status: 404 });
      }
    }

    return NextResponse.json({ code: "SUCCESS", message: "成功" });
  } catch (e) {
    console.error("wechat notify error:", e);
    return NextResponse.json({ code: "FAIL", message: "fail" }, { status: 500 });
  }
}

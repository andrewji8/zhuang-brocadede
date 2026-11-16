import { alipayAdapter } from "./alipay";
import { wechatAdapter } from "./wechatpay";
import { mockAdapter } from "./mock";
import type { PayAdapter, PayChannel } from "./types";

/**
 * 按 PAYMENT_MODE 返回支付适配器（M4）。
 *  - "mock"（默认）：本地全流程演练，无需营业执照/密钥
 *  - "alipay"：支付宝（需 ALIPAY_* 配齐，否则该分支降级/报错）
 *  - "wechat"：微信支付 v3（需 WECHAT_PAY_* 配齐，否则降级/报错）
 */
export function getPayAdapter(channel: PayChannel): PayAdapter {
  const mode = (process.env.PAYMENT_MODE ?? "mock").toLowerCase();
  switch (mode) {
    case "alipay":
      return channel === "wechat" ? wechatAdapter : alipayAdapter;
    case "wechat":
      return wechatAdapter;
    case "mock":
    default:
      // mock 模式：两个渠道都用 mock，本地可完整演示。
      return mockAdapter;
  }
}

export const PAY_MODE = (process.env.PAYMENT_MODE ?? "mock").toLowerCase();

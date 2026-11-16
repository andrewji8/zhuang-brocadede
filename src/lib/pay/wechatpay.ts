import type { PayAdapter, PayIntent, PayNotifyResult, Order } from "./types";

/**
 * 微信支付 v3（Native / H5）适配器骨架（M4）。
 *
 * 真实接入（需企业资质 + 商户号 + API v3 证书）：
 *  - createIntent：POST /v3/pay/transactions/native 拿 code_url，前端渲染二维码；
 *    请求需带 Wechatpay-Serial / 商户私钥 RSA-SHA256 签名。
 *  - handleNotify：验 Wechatpay-Signature（平台证书）+ 解密 resource 后按 out_trade_no 幂等更新。
 * 未配置时（本地测试）降级为 mock，保证链路可跑通。上线前务必接真实报文并验签。
 */

function isConfigured(): boolean {
  return Boolean(
    process.env.WECHAT_PAY_MCH_ID &&
      process.env.WECHAT_PAY_APP_ID &&
      process.env.WECHAT_PAY_API_KEY &&
      process.env.WECHAT_PAY_CERT_SERIAL
  );
}

export const wechatAdapter: PayAdapter = {
  name: "wechat",
  async createIntent(order: Order): Promise<PayIntent> {
    if (!isConfigured()) {
      const qr = `MOCK|wechat|${order.id}|CNY ${order.totalCny}`;
      return { orderId: order.id, channel: "wechat", qrCodeContent: qr, action: "scan" };
    }
    // TODO(生产)：POST https://api.mch.weixin.qq.com/v3/pay/transactions/native
    //  带商户私钥签名，取 response.code_url 作为二维码内容。
    //  const codeUrl = await requestNative({ out_trade_no: order.id, amount: { total: order.totalCny }, ... });
    //  return { orderId: order.id, channel: "wechat", qrCodeContent: codeUrl, action: "scan" };
    throw new Error("WECHAT_PAY not configured: 请在 .env 配齐 WECHAT_PAY_* 或保持 PAYMENT_MODE=mock");
  },
  async handleNotify(params: Record<string, string | undefined>): Promise<PayNotifyResult> {
    const orderId = params.out_trade_no ?? params.orderId ?? "";
    if (!isConfigured()) {
      return { orderId, status: "paid" };
    }
    // TODO(生产)：用平台证书验 Wechatpay-Signature，AES-256-GCM 解密 resource，
    //  仅 trade_state === "SUCCESS" 时更新订单。
    throw new Error("WECHAT_PAY not configured: 回调验签需正式证书");
  },
};

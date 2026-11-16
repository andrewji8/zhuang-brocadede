import type { PayAdapter, PayIntent, PayNotifyResult, Order } from "./types";

/**
 * Mock 支付适配器（M4 本地测试用）：
 *  - createIntent：生成一个「模拟二维码内容」（订单号+渠道+金额），不真实扣款。
 *  - handleNotify：模拟支付方成功回调，把订单标记为 paid（幂等）。
 * 用于没有营业执照/正式密钥前，在本地完整演练「下单→扫码→回调→订单成功」链路。
 * 上线前把 PAYMENT_MODE 切到 alipay / wechat，并删除或保留本文件均可。
 */
export const mockAdapter: PayAdapter = {
  name: "alipay", // mock 以 alipay 作为默认渠道展示；前端可自由切换
  async createIntent(order: Order): Promise<PayIntent> {
    // 确定性二维码内容：仅本地展示用，非真实支付宝/微信协议报文。
    const qr = `MOCK|yunsi|${order.id}|${order.channel ?? "alipay"}|CNY ${order.totalCny}`;
    return {
      orderId: order.id,
      channel: order.channel ?? "alipay",
      qrCodeContent: qr,
      action: "scan",
    };
  },
  async handleNotify(params: Record<string, string | undefined>): Promise<PayNotifyResult> {
    // 本地模拟：只要带 orderId 即视为支付成功（真实环境必须验签+对账）。
    const orderId = params.orderId ?? "";
    return { orderId, status: "paid" };
  },
};

import type { PayAdapter, PayIntent, PayNotifyResult, Order } from "./types";

/**
 * 支付宝「电脑网站支付 / 当面付」适配器骨架（M4）。
 *
 * 真实接入（npm i alipay-sdk）：
 *  - AppID + 应用私钥 + 支付宝公钥（RSA2）配到 .env
 *  - createIntent 调 alipay.trade.page.pay（跳转）或 alipay.trade.precreate（扫码）
 *  - handleNotify 验签（AlipaySdk.checkNotifySign）+ 按 out_trade_no 幂等更新订单
 *
 * 未配置正式密钥时（本地测试）：降级为 mock 行为，保证链路可跑通、页面可演示。
 * 上线前务必删除 mock 降级分支并接入真实报文。
 */

function isConfigured(): boolean {
  return Boolean(
    process.env.ALIPAY_APP_ID &&
      process.env.ALIPAY_APP_PRIVATE_KEY &&
      process.env.ALIPAY_PUBLIC_KEY
  );
}

export const alipayAdapter: PayAdapter = {
  name: "alipay",
  async createIntent(order: Order): Promise<PayIntent> {
    if (!isConfigured()) {
      // 本地测试降级：生成模拟二维码，不真实扣款。
      const qr = `MOCK|alipay|${order.id}|CNY ${order.totalCny}`;
      return { orderId: order.id, channel: "alipay", qrCodeContent: qr, action: "scan" };
    }

    // TODO(生产)：启用 alipay-sdk 真实下单。示例：
    // const AlipaySdk = (await import("alipay-sdk")).default;
    // const alipay = new AlipaySdk({
    //   app_id: process.env.ALIPAY_APP_ID,
    //   appPrivateKey: process.env.ALIPAY_APP_PRIVATE_KEY,
    //   alipayPublicKey: process.env.ALIPAY_PUBLIC_KEY,
    //   gateway: "https://openapi.alipay.com/gateway.do",
    //   signType: "RSA2",
    // });
    // const { alipayTradePagePayResponse } = await alipay.exec(
    //   "alipay.trade.page.pay",
    //   { bizContent: { out_trade_no: order.id, total_amount: String(order.totalCny / 100), subject: "YUNSI 云丝订单" } }
    // );
    // return { orderId: order.id, channel: "alipay", qrCodeContent: alipayTradePagePayResponse.alipayTradePagePayResponse.qrCode ?? alipayTradePagePayResponse.alipayTradePagePayResponse.tradeNo, action: "scan" };
    throw new Error("ALIPAY not configured: 请在 .env 填齐 ALIPAY_* 或保持 PAYMENT_MODE=mock");
  },
  async handleNotify(params: Record<string, string | undefined>): Promise<PayNotifyResult> {
    const orderId = params.out_trade_no ?? params.orderId ?? "";
    if (!isConfigured()) {
      return { orderId, status: "paid" };
    }
    // TODO(生产)：AlipaySdk.checkNotifySign(params) 验签；
    // 仅当 trade_status === "TRADE_SUCCESS"/"TRADE_FINISHED" 时更新订单，返回 {success:true}。
    throw new Error("ALIPAY not configured: 回调验签需正式密钥");
  },
};

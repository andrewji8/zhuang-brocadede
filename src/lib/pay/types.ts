/** 支付层公共类型（M4）：可切换 adapter，默认 mock，配 key 后切 alipay/wechat。 */

export type PayChannel = "alipay" | "wechat";
export type PayStatus = "pending" | "paid" | "shipped" | "delivered" | "refunded" | "closed";
export type PayItem = {
  slug: string;
  name: string;
  color: string;
  size: string;
  qty: number;
  unitPriceCny: number;
};
export type Order = {
  id: string;
  customerEmail?: string;
  customerName?: string;
  items: PayItem[];
  totalCny: number;
  status: PayStatus;
  channel: PayChannel | null;
  createdAt: string;
  paidAt?: string;
};

export type PayIntent = {
  orderId: string;
  channel: PayChannel;
  /** mock：本地二维码内容；alipay：跳转 URL；wechat：Native 二维码内容。 */
  qrCodeContent: string;
  /** alipay「电脑网站支付」是跳转；wechat Native 是扫码。区分前端行为。 */
  action: "scan" | "redirect";
};

export type PayNotifyResult = { orderId: string; status: PayStatus };

export type PayAdapter = {
  name: PayChannel;
  /** 建支付意图：给订单返回二维码/跳转 URL。 */
  createIntent(order: Order): Promise<PayIntent>;
  /** 处理支付方回调（验签+幂等）：更新订单为 paid。 */
  handleNotify(params: Record<string, string | undefined>): Promise<PayNotifyResult>;
};

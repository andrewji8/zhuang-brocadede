# ZHUAJIN 壮锦

一个**完全原创**的壮锦（Zhuang Brocade）手工织锦电商站概念项目（Next.js + Tailwind CSS v4）。
设计语言参考高端织物的通用版式（宽留白 / 大图 Hero / 商品网格 / 胶囊按钮），
**不包含任何第三方品牌（含 LilySilk）的受保护内容**——配色、纹样、文案、商品、图片均为原创。

> 壮锦（Zuàng Brocade）是广西壮族传统手工挑花织锦，国家级非物质文化遗产。
> 本站为「纹样 + 电商」的概念演示：把山与水的民族纹样，织进日常好物。

---

## 技术栈

- **Next.js 16**（App Router + TypeScript + Turbopack）
- **Tailwind CSS v4**（`globals.css` 内 `@theme` 设计令牌）
- 商品图：AI 生成的壮锦静物摄影（`public/products/`），程序化 SVG 菱形挑花纹样作为回退
- 支付：可切换的 mock / 支付宝 / 微信 adapter（M4，默认 mock 本地全流程）

## 设计令牌（原创·壮锦色板）

| 角色 | 色值 | 说明 |
|---|---|---|
| 主色 | `#1f2d5c` 靛蓝 | 传统蓝染，品牌 / CTA |
| 强调 | `#c1442e` 朱红 | 壮锦点缀色 |
| 织金 | `#c8963c` 藤黄 | 几何纹样金线 |
| 背景 | `#f5f1e8` 蜡染米白 | 页面底 |

字体：`DM Serif Display`（标题）+ `Inter`（正文）+ `Noto Serif SC`（中文），全部免费可商用。

## 快速开始

```bash
npm install
npm run dev            # http://localhost:3000
npm run build
npm run lint
```

无需配置即可运行：商品数据来自 `src/data/products.ts` 种子（12 SKU），
商品图来自 `public/products/*.png`，缺图时自动回退程序化壮锦纹样 SVG。

## 目录结构

```
src/
  app/                  # 页面（App Router）
    page.tsx            # 首页（Hero + 新品 + 分类磁贴 + 故事 + 订阅）
    shop/               # 商店（筛选 + 排序）
    product/[slug]/     # 商品详情（画廊 + 颜色规格 + 手风琴 + 相关推荐）
    collections/        # 系列（山与水/日常讲究/送礼有心）
    about/              # 关于
    journal/            # 壮锦知识日志（3 篇）
    checkout/           # 结算（渠道选择 + 模拟扫码）
    order/[id]/         # 订单状态
    api/                # 支付 API（checkout / order / notify-alipay / notify-wechat）
  components/
    product-art.tsx     # 程序化 SVG 壮锦菱形挑花纹样（无二进制依赖）
    product-image.tsx   # 图片管线（真实图优先，失败回退 SVG）
    cart.tsx            # 购物车抽屉（localStorage + 加购轻提示 + 清空）
    header/footer/newsletter/mock-qr
  data/products.ts      # 12 SKU 壮锦种子 + 日志/关于内容（全部原创）
  lib/pay/              # 支付适配器（mock/alipay/wechat 可切换）
  lib/orders.ts         # 本地 JSON 订单存储（可切 Supabase）
public/products/        # 13 张 AI 生成壮锦商品图（含 hero）
```

## 商品目录（12 SKU，原创）

围巾 · 抱枕 · 桌旗 · 马甲 · 连衣裙 · 手提包 · 托特包 · 床品 · 枕套 · 腰带 · 礼盒 · 挂毯，
纹样语言统一：菱形挑花、回字纹、莲花、鱼纹，配色靛蓝 / 朱红 / 藤黄。

## 合规

本项目所有视觉素材与文案均为原创。请勿将任何第三方品牌内容（图片、文案、商标）混入本仓库。

## License

MIT（代码）。商品图与文案为项目原创资产。

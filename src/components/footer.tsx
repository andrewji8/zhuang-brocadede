import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl text-primary">
            ZHUAJIN<span className="ml-2 text-sm text-mute">壮锦</span>
          </p>
          <p className="mt-3 max-w-sm text-sm text-mute">
            广西山区壮族手工挑花织锦，靛蓝、朱红、藤黄。把千年纹样，织进日常。
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs tracking-widest text-mute">选购</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-primary" href="/shop">全部商品</Link></li>
            <li><Link className="hover:text-primary" href="/collections">系列</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-xs tracking-widest text-mute">品牌</p>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:text-primary" href="/about">关于</Link></li>
            <li><Link className="hover:text-primary" href="/journal">日志</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1280px] flex-col justify-between gap-2 px-6 py-5 text-xs text-mute md:flex-row">
          <span>© 2026 ZHUAJIN 壮锦 · 本站为原创概念演示</span>
          <span>支持支付宝 · 微信支付</span>
        </div>
      </div>
    </footer>
  );
}

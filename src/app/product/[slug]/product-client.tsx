"use client";

import { useState } from "react";
import Link from "next/link";
import { PRODUCTS, productImageSrc } from "@/data/products";
import { useCart } from "@/components/cart";
import { ProductImage } from "@/components/product-image";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";

export function ProductDetailClient({ productSlug }: { productSlug: string }) {
  const product = PRODUCTS.find((p) => p.slug === productSlug);
  const { add } = useCart();
  const [color, setColor] = useState(product?.colors[0] ?? "");
  const [size, setSize] = useState(product?.sizes[0] ?? "");
  const [openFaq, setOpenFaq] = useState<string | null>("fabric");

  if (!product) return null;

  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 4);

  const faqs = [
    {
      key: "fabric",
      title: "面料与工艺",
      body: `${product.material}，${product.weight}。经彩纬素，手工挑花，一天仅出数厘米。`,
    },
    {
      key: "care",
      title: "洗涤与保养",
      body: "冷水手洗、中性皂，勿拧勿搓挑花处；平铺阴干、反面朝外；避光防尘存放。",
    },
    {
      key: "ship",
      title: "配送与退换",
      body: "顺丰包邮，48 小时内发出；90 天无理由退换；支持终身修补。",
    },
  ];

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <nav className="mb-6 text-sm text-mute">
        <Link href="/shop" className="hover:text-primary">商店</Link>
        <span className="mx-2">/</span>
        <span>{product.category}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        {/* 画廊 */}
        <div>
          <div className="aspect-[3/4] w-full overflow-hidden rounded-card bg-line">
            <ProductImage
              image={productImageSrc(product.slug)}
              slug={product.slug}
              color={color}
              ratio={3 / 4}
              label={`${product.name}（${color}）`}
              eager
            />
          </div>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-img bg-line">
                <ProductArt
                  slug={product.slug + i}
                  color={product.colors[i % product.colors.length]}
                  ratio={1}
                  label={`${product.name} 细节 ${i + 1}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* 信息 */}
        <div>
          <p className="text-xs tracking-widest text-mute">{product.category}</p>
          <h1 className="mt-2 font-display text-3xl text-ink">{product.name}</h1>
          <p className="mt-3 text-mute">{product.shortDesc}</p>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl text-primary">
              ¥{product.priceCny}
            </span>
            <span className="text-mute line-through">¥{product.originalPriceCny}</span>
          </div>

          {/* 颜色 */}
          <div className="mt-8">
            <p className="mb-3 text-sm text-mute">颜色 · {color}</p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`rounded-full px-4 py-2 text-sm ${
                    color === c
                      ? "bg-primary text-surface"
                      : "border border-line text-mute"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 尺码 */}
          <div className="mt-6">
            <p className="mb-3 text-sm text-mute">规格</p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`h-10 min-w-10 rounded-img border px-3 text-sm ${
                    size === s ? "border-primary bg-surface" : "border-line text-mute"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => add(product, color, size)}
            className="mt-8 w-full rounded-pill bg-primary py-3.5 text-sm font-medium text-surface hover:opacity-90 md:w-auto md:px-12"
          >
            加入购物车 — ¥{product.priceCny}
          </button>

          {/* 手风琴 */}
          <div className="mt-10 divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <div key={f.key}>
                <button
                  onClick={() => setOpenFaq(openFaq === f.key ? null : f.key)}
                  className="flex w-full items-center justify-between py-4 text-left text-ink"
                >
                  <span>{f.title}</span>
                  <span className="text-mute">{openFaq === f.key ? "−" : "+"}</span>
                </button>
                {openFaq === f.key && (
                  <p className="pb-4 text-sm text-mute">{f.body}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 相关推荐 */}
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-8 font-display text-2xl text-ink">同系列推荐</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

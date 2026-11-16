"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./cart";
import { ProductImage } from "./product-image";
import { productImageSrc, type Product } from "@/data/products";

const COLOR_SWATCH: Record<string, [string, string]> = {
  靛蓝: ["#3a5a8c", "#1f2d5c"],
  朱红: ["#d96a4a", "#8f2e2e"],
  藤黄: ["#e3b24c", "#c8963c"],
  月白: ["#efe9da", "#cfc7b2"],
  墨绿: ["#3f5a4a", "#274435"],
  黛紫: ["#5a4a6a", "#3a2f4a"],
};

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [color, setColor] = useState(product.colors[0]);
  const off = Math.round(1 - product.priceCny / product.originalPriceCny);

  return (
    <div className="group flex flex-col">
      <Link
        href={`/product/${product.slug}`}
        className="relative overflow-hidden rounded-img bg-line"
      >
        <div className="aspect-[3/4] w-full overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
          <ProductImage
            image={productImageSrc(product.slug)}
            slug={product.slug}
            color={color}
            ratio={3 / 4}
            label={product.altText}
          />
        </div>
        {off > 0 && (
          <span className="absolute left-3 top-3 rounded-pill bg-primary/90 px-3 py-1 text-xs text-surface">
            -{off}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <p className="text-xs tracking-widest text-mute">{product.category}</p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 font-medium text-ink hover:text-primary"
        >
          {product.name}
        </Link>
        <p className="mt-1 line-clamp-1 text-sm text-mute">{product.shortDesc}</p>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg text-primary">
            ¥{product.priceCny}
          </span>
          {off > 0 && (
            <span className="text-xs text-mute line-through">
              ¥{product.originalPriceCny}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-4 text-sm">
          <button
            onClick={() => add(product, color)}
            className="rounded-pill bg-primary px-5 py-2 text-surface transition-opacity hover:opacity-90"
          >
            加入购物车
          </button>
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 4).map((c) => {
              const [c1, c2] = COLOR_SWATCH[c] ?? ["#cfc7b2", "#8a8168"];
              const active = color === c;
              return (
                <button
                  key={c}
                  title={c}
                  aria-label={`颜色 ${c}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setColor(c);
                  }}
                  className={`h-4 w-4 rounded-full border transition-shadow ${
                    active ? "ring-2 ring-primary ring-offset-1" : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${c1}, ${c2})`,
                    borderColor: active ? "var(--color-primary)" : "var(--color-line, #e4ddcc)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

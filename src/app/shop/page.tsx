"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import { ProductCard } from "@/components/product-card";

type Sort = "featured" | "price-asc" | "price-desc" | "discount";

function ShopInner() {
  const params = useSearchParams();
  const initialCat = params.get("cat") ?? "全部";
  const [cat, setCat] = useState<string>(initialCat);
  const [sort, setSort] = useState<Sort>("featured");

  const list = useMemo(() => {
    let items =
      cat === "全部" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);
    items = [...items];
    if (sort === "price-asc") items.sort((a, b) => a.priceCny - b.priceCny);
    if (sort === "price-desc") items.sort((a, b) => b.priceCny - a.priceCny);
    if (sort === "discount")
      items.sort(
        (a, b) =>
          (1 - b.priceCny / b.originalPriceCny) -
          (1 - a.priceCny / a.originalPriceCny)
      );
    return items;
  }, [cat, sort]);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <h1 className="font-display text-4xl text-primary">商店</h1>
      <p className="mt-2 text-mute">全部手工挑花壮锦，按品类与价格随心逛。</p>

      <div className="mt-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`rounded-pill px-4 py-1.5 text-sm transition-colors ${
                cat === c
                  ? "bg-primary text-surface"
                  : "border border-line text-mute hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="rounded-img border border-line bg-surface px-4 py-2 text-sm text-ink"
        >
          <option value="featured">推荐排序</option>
          <option value="price-asc">价格从低到高</option>
          <option value="price-desc">价格从高到低</option>
          <option value="discount">折扣最大</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-mute">{cat} · 共 {list.length} 件</p>

      <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
        {list.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
      {list.length === 0 && (
        <p className="py-20 text-center text-mute">暂无该品类的商品。</p>
      )}
    </div>
  );
}

export default function Shop() {
  return (
    <Suspense fallback={<div className="py-32 text-center text-mute">加载中…</div>}>
      <ShopInner />
    </Suspense>
  );
}

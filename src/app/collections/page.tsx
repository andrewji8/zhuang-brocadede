import Link from "next/link";
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/product-card";
import { ProductArt } from "@/components/product-art";

const COLLECTIONS = [
  {
    slug: "mountain-water",
    name: "山与水 · 家居系列",
    desc: "抱枕、桌旗、床品——把壮锦铺进屋子。",
    color: "靛蓝",
    filter: "家居",
  },
  {
    slug: "everyday-lore",
    name: "日常讲究 · 衣饰系列",
    desc: "马甲、连衣裙、腰带——民族风单品，通勤皆可。",
    color: "朱红",
    filter: "服饰",
  },
  {
    slug: "gift-of-brocade",
    name: "送礼有心 · 礼盒系列",
    desc: "含刻字的节庆、乔迁、外事赠送礼盒。",
    color: "藤黄",
    filter: "礼盒",
  },
];

export default function Collections() {
  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12">
      <h1 className="font-display text-4xl text-primary">系列</h1>
      <p className="mt-2 max-w-xl text-mute">
        围绕「日常讲究」的三个系列，按你的场景挑。
      </p>

      <div className="mt-10 space-y-16">
        {COLLECTIONS.map((c) => {
          const items =
            c.filter === "全部"
              ? PRODUCTS
              : PRODUCTS.filter((p) => p.category === c.filter);
          return (
            <section key={c.slug}>
              <div className="mb-6 flex items-center gap-5">
                <div className="h-14 w-14 overflow-hidden rounded-img bg-line">
                  <ProductArt
                    slug={c.slug}
                    color={c.color}
                    ratio={1}
                    label={c.name}
                  />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-ink">{c.name}</h2>
                  <p className="text-sm text-mute">{c.desc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {items.slice(0, 4).map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
              <Link
                href={`/shop?cat=${encodeURIComponent(c.filter)}`}
                className="mt-6 inline-block text-sm text-primary underline"
              >
                查看{c.filter}全部 →
              </Link>
            </section>
          );
        })}
      </div>
    </div>
  );
}

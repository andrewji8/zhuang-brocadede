export type Product = {
  slug: string;
  name: string;
  category: string;
  priceCny: number;
  originalPriceCny: number;
  colors: string[];
  sizes: string[];
  material: string;
  weight: string;
  shortDesc: string;
  altText: string;
};

/** 商品图文件名：去掉 slug 的 "zhuang-brocadede-" 前缀。 */
export const imageSlug = (slug: string) => slug.replace(/^zhuang-brocadede-/, "");

export function productImageSrc(slug: string): string {
  const file = `${imageSlug(slug)}.png`;
  const base =
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE ??
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (base) {
    return `${base.replace(/\/$/, "")}/storage/v1/object/public/product-images/${file}`;
  }
  return `/products/${file}`;
}

export const heroImageSrc = (): string =>
  process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE
    ? `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE.replace(/\/$/, "")}/product-images/hero.png`
    : "/products/hero.png";

export type JournalPost = {
  slug: string;
  title: string;
  summary: string;
  sections: { heading: string; body: string }[];
  cta: string;
};

/**
 * 壮锦商品目录（原创，12 SKU）。壮锦（Zuàng Brocade）是壮族传统手工挑花织锦，
 * 国家级非物质文化遗产。文案为原创草稿，产地/工艺按真实供应链填写。
 */
export const PRODUCTS: Product[] = [
  { slug: "zhuang-brocadede-scarf-indigo", name: "壮锦围巾·靛蓝回纹", category: "围巾", priceCny: 399, originalPriceCny: 599, colors: ["靛蓝", "藤黄", "朱红"], sizes: ["150cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "靛蓝底配藤黄回纹，手工挑花围巾，民族纹样日常可用。", altText: "靛蓝底壮锦回纹围巾" },
  { slug: "zhuang-brocadede-cushion-lotus", name: "壮锦抱枕·莲花纹", category: "家居", priceCny: 299, originalPriceCny: 429, colors: ["朱红", "靛蓝", "藤黄"], sizes: ["45×45cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "莲花与鱼纹组合，客厅沙发一枕即是风景。", altText: "朱红底壮锦莲花抱枕" },
  { slug: "zhuang-brocadede-table-runner", name: "壮锦桌旗·菱形挑花", category: "家居", priceCny: 459, originalPriceCny: 659, colors: ["靛蓝", "藤黄", "墨绿"], sizes: ["180cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "长条菱形挑花桌旗，宴客与茶席两用。", altText: "靛蓝菱形壮锦桌旗" },
  { slug: "zhuang-brocadede-vest", name: "壮锦马甲·几何纹", category: "服饰", priceCny: 799, originalPriceCny: 1199, colors: ["朱红", "靛蓝", "黛紫"], sizes: ["S", "M", "L", "XL"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "前襟挑花马甲，内搭外穿皆可，民族风单品。", altText: "朱红几何纹壮锦马甲" },
  { slug: "zhuang-brocadede-dress", name: "壮锦连衣裙·菱形纹", category: "服饰", priceCny: 1099, originalPriceCny: 1599, colors: ["靛蓝", "黛紫", "墨绿"], sizes: ["S", "M", "L"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "菱形挑花连衣裙，腰封收腰，行走间纹样流动。", altText: "靛蓝菱形壮锦连衣裙" },
  { slug: "zhuang-brocadede-bag", name: "壮锦手提包·回字纹", category: "包袋", priceCny: 559, originalPriceCny: 799, colors: ["藤黄", "靛蓝", "朱红"], sizes: ["25×18cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "回字纹壮锦手提包，内衬棉布，日常通勤。", altText: "藤黄回字纹壮锦手提包" },
  { slug: "zhuang-brocadede-tote", name: "壮锦托特包·鱼纹", category: "包袋", priceCny: 489, originalPriceCny: 699, colors: ["靛蓝", "墨绿", "藤黄"], sizes: ["35×30cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "鱼纹壮锦托特包，大容量，海边与校园皆宜。", altText: "靛蓝鱼纹壮锦托特包" },
  { slug: "zhuang-brocadede-bead-set", name: "壮锦床品·菱形格", category: "床品", priceCny: 899, originalPriceCny: 1299, colors: ["靛蓝", "墨绿", "月白"], sizes: ["1.5m", "1.8m"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "菱形格壮锦床品，给卧室加一层民族质感。", altText: "靛蓝菱形格壮锦床品" },
  { slug: "zhuang-brocadede-pillow", name: "壮锦枕套·莲花纹", category: "床品", priceCny: 259, originalPriceCny: 369, colors: ["朱红", "靛蓝", "藤黄"], sizes: ["均码"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "莲花纹壮锦枕套，枕面即是纹样。", altText: "朱红莲花纹壮锦枕套" },
  { slug: "zhuang-brocadede-belt", name: "壮锦腰带·回纹", category: "配饰", priceCny: 329, originalPriceCny: 459, colors: ["藤黄", "靛蓝", "黛紫"], sizes: ["可调节"], material: "铜扣·壮锦", weight: "手工织造", shortDesc: "回纹壮锦腰带，搭配马甲与连衣裙，民族点睛。", altText: "藤黄回纹壮锦腰带" },
  { slug: "zhuang-brocadede-giftbox", name: "壮锦礼盒·定制", category: "礼盒", priceCny: 1299, originalPriceCny: 1899, colors: ["朱红", "靛蓝"], sizes: ["均码"], material: "多件组合·壮锦", weight: "手工织造", shortDesc: "含刻字的乔迁、节庆、外事赠送礼盒。", altText: "壮锦礼盒开启特写" },
  { slug: "zhuang-brocadede-wall-hanging", name: "壮锦挂毯·菱形挑花", category: "家居", priceCny: 999, originalPriceCny: 1499, colors: ["靛蓝", "藤黄", "墨绿"], sizes: ["90×130cm"], material: "棉线挑花·壮锦", weight: "手工织造", shortDesc: "菱形挑花挂毯，玄关与墙面，一眼东方。", altText: "靛蓝菱形壮锦挂毯" },
];

export const CATEGORIES = ["全部", "围巾", "家居", "服饰", "包袋", "床品", "配饰", "礼盒"];

export const getCategories = () => CATEGORIES;

export const JOURNAL: JournalPost[] = [
  {
    slug: "what-is-zhuang-brocade",
    title: "壮锦是什么？一块布背后的千年纹样",
    summary: "壮锦与云锦、蜀锦、宋锦并称中国四大名锦，却几乎只在广西山间流传。它凭什么被叫做「布上史诗」。",
    sections: [
      { heading: "四大名锦之一", body: "壮锦以棉线挑花、经彩纬素，纹样多为菱形几何与回字纹，配色浓烈，多为靛蓝、朱红、藤黄。" },
      { heading: "纹样即叙事", body: "一块壮锦常藏数十种纹样，鱼纹、莲花、菱形都对应壮族的山与水、农耕与节庆，是织进布里的历史。" },
      { heading: "为什么稀缺", body: "一架旧式织机一天只出几厘米，一个完整纹样要数日。能挑花织锦的手艺人，正在变少。" },
    ],
    cta: "看看我们的手工挑花系列",
  },
  {
    slug: "how-to-spot-honest-brocade",
    title: "手工挑花与机织仿锦，怎么一眼分辨",
    summary: "「看着像」不等于「是」。三个细节，一分钟分清手工壮锦与印花仿品。",
    sections: [
      { heading: "看经纬", body: "手工挑花是「经线织、纬线素」，正反纹样不同；印花仿品正反面一样。" },
      { heading: "摸手感", body: "手工锦粗粝有颗粒感，边缘偶有挑花毛须；机织平整、四边齐整。" },
      { heading: "看配色", body: "传统壮锦用天然与耐褪色染，色有深浅；机仿品往往色相单一、偏艳。" },
    ],
    cta: "只挑手工，看我们的溯源卡",
  },
  {
    slug: "caring-for-brocade",
    title: "壮锦怎么洗、怎么存，一次讲透",
    summary: "挑花织锦娇气但耐用。三件事做对，一块锦传得下去。",
    sections: [
      { heading: "洗", body: "冷水手洗、中性皂，勿拧勿搓挑花处；大件建议只洗内衬。" },
      { heading: "晾", body: "平铺阴干、反面朝外，避免日光直射褪色。" },
      { heading: "存", body: "折好垫纸、避光防尘，挂毯用布袋平放，勿久挂变形。" },
    ],
    cta: "配一条桌旗，把纹样摆进日常",
  },
];

export const ABOUT_PARAGRAPHS: { title: string; body: string }[] = [
  { title: "我们从哪里来", body: "Zhuang Brocadede，始于广西山区的壮族织锦村。我们把「一块好壮锦」拆成三个问题：纹样从哪里来、怎么变成物、凭什么让你放心。答案是：老织机、老手艺，和一张能扫码的溯源卡。" },
  { title: "工艺", body: "壮锦用「经彩纬素」的挑花法：经线预先挑出几何纹，纬线素色压织，一天只出几厘米。我们用靛蓝、朱红、藤黄三主色，配回字纹、菱形、莲花与鱼纹，全部手工挑花、手工收边。" },
  { title: "可持续", body: "壮锦用的是棉线，可降解、可修补。我们承诺：包装零塑料、旧物回收、每 100 件订单支持一位织娘的工坊补贴。" },
  { title: "给你的一句话", body: "民族纹样不是装饰，是穿在家里的历史。一块能用很多年的壮锦，比十件快时尚更划算。" },
];

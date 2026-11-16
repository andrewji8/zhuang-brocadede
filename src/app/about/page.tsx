import { ABOUT_PARAGRAPHS } from "@/data/products";

export const metadata = { title: "关于" };

export default function About() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.2em] text-accent">OUR STORY</p>
      <h1 className="mt-4 font-display text-4xl text-primary">关于 ZHUAJIN 壮锦</h1>

      <div className="mt-10 space-y-10">
        {ABOUT_PARAGRAPHS.map((p) => (
          <section key={p.title}>
            <h2 className="font-display text-2xl text-ink">{p.title}</h2>
            <p className="mt-3 leading-relaxed text-mute">{p.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 grid gap-6 rounded-card bg-surface p-8 sm:grid-cols-3">
        <div>
          <p className="font-display text-3xl text-primary">100%</p>
          <p className="mt-1 text-sm text-mute">手工挑花织造</p>
        </div>
        <div>
          <p className="font-display text-3xl text-primary">0</p>
          <p className="mt-1 text-sm text-mute">塑料包装</p>
        </div>
        <div>
          <p className="font-display text-3xl text-primary">90 天</p>
          <p className="mt-1 text-sm text-mute">无理由退换</p>
        </div>
      </div>
    </div>
  );
}

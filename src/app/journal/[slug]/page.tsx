import Link from "next/link";
import { notFound } from "next/navigation";
import { JOURNAL } from "@/data/products";

export function generateStaticParams() {
  return JOURNAL.map((p) => ({ slug: p.slug }));
}

export default async function JournalPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = JOURNAL.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <article className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-xs tracking-[0.2em] text-accent">JOURNAL</p>
      <h1 className="mt-4 font-display text-3xl leading-snug text-ink">
        {post.title}
      </h1>
      <p className="mt-4 text-mute">{post.summary}</p>

      <div className="mt-10 space-y-8">
        {post.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl text-primary">{s.heading}</h2>
            <p className="mt-2 leading-relaxed text-mute">{s.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-card bg-surface p-6">
        <p className="text-mute">{post.cta}</p>
        <Link
          href="/shop"
          className="mt-4 inline-block rounded-pill bg-primary px-6 py-3 text-sm text-surface"
        >
          去商店看看
        </Link>
      </div>

      <Link
        href="/journal"
        className="mt-10 inline-block text-sm text-mute hover:text-primary"
      >
        ← 返回日志
      </Link>
    </article>
  );
}

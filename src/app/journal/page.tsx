import Link from "next/link";
import { JOURNAL } from "@/data/products";

export const metadata = { title: "日志" };

export default function JournalIndex() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs tracking-[0.2em] text-accent">JOURNAL</p>
      <h1 className="mt-4 font-display text-4xl text-primary">日志</h1>
      <p className="mt-3 text-mute">
        讲一块壮锦从山间到屋里的路，也帮你把「手工挑花」搞明白。
      </p>

      <div className="mt-10 divide-y divide-line border-y border-line">
        {JOURNAL.map((post) => (
          <Link
            key={post.slug}
            href={`/journal/${post.slug}`}
            className="group block py-8"
          >
            <p className="text-xs tracking-widest text-mute">壮锦知识</p>
            <h2 className="mt-2 font-display text-2xl text-ink group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-2 text-mute">{post.summary}</p>
            <span className="mt-3 inline-block text-sm text-primary">阅读全文 →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

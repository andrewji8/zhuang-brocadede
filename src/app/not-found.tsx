import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-32 text-center">
      <p className="font-display text-6xl text-primary">404</p>
      <p className="mt-4 text-mute">这一页不在我们的织机上。</p>
      <Link
        href="/"
        className="mt-8 rounded-pill bg-primary px-7 py-3 text-sm text-surface"
      >
        回到首页
      </Link>
    </div>
  );
}

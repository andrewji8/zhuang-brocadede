import { useId } from "react";

/**
 * 程序化壮锦 SVG 纹样 —— 每个商品由 slug + 颜色确定性生成，无二进制依赖。
 * 壮锦（Zhuang brocade）为壮族传统手工挑花织锦：几何菱形、回字纹、对比色织造。
 * 这里用「菱形格 + 织纹条 + 中心回字」近似其纹样语言，颜色映射到壮锦色板。
 */

/* 壮锦色板：[浅, 深] 双色，用于菱形明暗与条纹 */
const COLOR_MAP: Record<string, [string, string, string]> = {
  靛蓝: ["#3a5a8c", "#1f2d5c", "#c8963c"],
  朱红: ["#d96a4a", "#8f2e2e", "#f0e6d2"],
  藤黄: ["#e3b24c", "#c8963c", "#1f2d5c"],
  月白: ["#efe9da", "#cfc7b2", "#1f2d5c"],
  墨绿: ["#3f5a4a", "#274435", "#c8963c"],
  黛紫: ["#5a4a6a", "#3a2f4a", "#c8963c"],
  默认: ["#cfc7b2", "#8a8168", "#1f2d5c"],
};

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) % 1000;
}

export function ProductArt({
  slug,
  color = "默认",
  ratio = 3 / 4,
  label,
}: {
  slug: string;
  color?: string;
  ratio?: number;
  label?: string;
}) {
  const [c1, c2, accent] = COLOR_MAP[color] ?? COLOR_MAP["默认"];
  const seed = hashSeed(slug + color);
  const gid = useId().replace(/:/g, "");
  const w = 100;
  const h = Math.round((100 / ratio) * 1);

  // 菱形格：交错两列的 lozenge，明暗交替
  const cell = 12 + (seed % 5);
  const cols = Math.ceil(w / cell) + 2;
  const rows = Math.ceil(h / cell) + 2;
  const lozenges: React.ReactNode[] = [];
  for (let r = -1; r < rows; r++) {
    for (let c = -1; c < cols; c++) {
      const cx = c * cell + (r % 2 ? cell / 2 : 0);
      const cy = r * cell;
      const fillDark = (r + c) % 2 === 0;
      lozenges.push(
        <polygon
          key={`${r}-${c}`}
          points={`${cx},${cy - cell / 2} ${cx + cell / 2},${cy} ${cx},${
            cy + cell / 2
          } ${cx - cell / 2},${cy}`}
          fill={fillDark ? c1 : c2}
          stroke={accent}
          strokeWidth={0.3}
          opacity={fillDark ? 0.95 : 0.85}
        />
      );
    }
  }

  // 中心回字纹（壮锦常见方形回纹）
  const cx = w / 2;
  const cy = h / 2;
  const s1 = 18 + (seed % 8);
  const s2 = s1 * 0.62;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={label ?? "壮锦商品图"}
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={`g-${gid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={c1} />
          <stop offset="100%" stopColor={c2} />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill={`url(#g-${gid})`} />
      {/* 菱形挑花格 */}
      <g opacity="0.9">{lozenges}</g>
      {/* 中心方形回字 */}
      <rect
        x={cx - s1}
        y={cy - s1}
        width={s1 * 2}
        height={s1 * 2}
        fill="none"
        stroke={accent}
        strokeWidth={1.2}
      />
      <rect
        x={cx - s2}
        y={cy - s2}
        width={s2 * 2}
        height={s2 * 2}
        fill={c2}
        stroke={accent}
        strokeWidth={0.8}
      />
      {/* 织纹高光 */}
      <ellipse
        cx={w * 0.3}
        cy={h * 0.24}
        rx={w * 0.45}
        ry={h * 0.12}
        fill="rgba(255,255,255,0.14)"
      />
    </svg>
  );
}

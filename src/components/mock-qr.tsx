"use client";

/**
 * 依赖-free 的「二维码」视觉组件（仅本地 mock 演示用，不可真实扫码）。
 * 用内容字符串做确定性哈希，渲染一个伪二维码网格 + 内容说明，
 * 让用户在本地完整演练「扫码支付」的交互，无需真实支付宝/微信协议报文。
 */
export function MockQR({
  content,
  size = 200,
}: {
  content: string;
  size?: number;
}) {
  const n = 21; // 21x21 格
  const cell = size / n;

  // 由内容生成确定性的 0/1 矩阵（伪随机但可复现）
  let seed = 0;
  for (let i = 0; i < content.length; i++) seed = (seed * 31 + content.charCodeAt(i)) >>> 0;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return (seed >>> 16) & 1;
  };

  const cells: boolean[] = [];
  for (let i = 0; i < n * n; i++) cells.push(rand() === 1);

  // 三个角定位图案（让视觉更像二维码）
  const finder = (r: number, c: number) => {
    for (let dr = 0; dr < 7; dr++)
      for (let dc = 0; dc < 7; dc++) {
        const border = dr === 0 || dr === 6 || dc === 0 || dc === 6;
        const center = dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4;
        if (border || center) cells[(r + dr) * n + (c + dc)] = true;
        else cells[(r + dr) * n + (c + dc)] = false;
      }
  };
  finder(0, 0);
  finder(0, n - 7);
  finder(n - 7, 0);

  const rects: React.ReactNode[] = [];
  cells.forEach((on, i) => {
    if (!on) return;
    const r = Math.floor(i / n);
    const c = i % n;
    rects.push(
      <rect key={i} x={c * cell} y={r * cell} width={cell} height={cell} />
    );
  });

  return (
    <div
      style={{ width: size, height: size + 44 }}
      className="mx-auto flex flex-col items-center"
    >
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        className="rounded-img bg-white p-2 ring-1 ring-line"
        role="img"
        aria-label="模拟支付二维码（本地测试，不可真实扫码）"
      >
        {rects}
      </svg>
      <p className="mt-2 text-center text-xs text-mute">
        模拟二维码（本地测试，不可真实扫码）
      </p>
    </div>
  );
}

/**
 * Builds the SVG path for the wireframe "floor": wavy horizontal rows plus
 * lines converging on a vanishing point. Pure function, so it renders on the server.
 */
export function meshPath({
  width,
  height,
  rows,
  wave,
  columnGap,
  spread = 0.18,
}: {
  width: number;
  height: number;
  rows: number[];
  wave: number;
  columnGap: number;
  spread?: number;
}): string {
  const mid = width / 2;
  const parts: string[] = [];
  for (const y of rows) {
    parts.push(`M0 ${y} C ${width * 0.25} ${y - wave}, ${width * 0.75} ${y + wave}, ${width} ${y}`);
  }
  for (let x = -width / 2; x <= width * 1.5; x += columnGap) {
    parts.push(`M${(mid + (x - mid) * spread).toFixed(1)} 0 L${x} ${height}`);
  }
  return parts.join(" ");
}

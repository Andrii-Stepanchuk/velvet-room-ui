export function moonLitPath(r: number, illumination: number, waxing: boolean): string {
  const k = Math.min(Math.max(illumination, 0), 1);
  const rx = r * Math.abs(1 - 2 * k);
  const outerSweep = waxing ? 1 : 0;
  const innerSweep = waxing === k > 0.5 ? 1 : 0;
  return `M ${r} 0 A ${r} ${r} 0 0 ${outerSweep} ${r} ${2 * r} A ${rx} ${r} 0 0 ${innerSweep} ${r} 0 Z`;
}

export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  const validBps = breakpoints.filter(
    (bp) => typeof values[bp] === "number"
  );

  if (validBps.length < 2) return {};

  const sortedBps = [...validBps].sort((a, b) => b - a);
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax] as number;
    const valMin = values[bpMin] as number;

    if (typeof valMax !== "number" || typeof valMin !== "number") continue;

    // Convert min value to rem (assuming default 16px = 1rem)
    const remBase = valMin / 16;

    // XX = min_viewport / 100
    const XX = bpMin / 100;

    // YY = 100 * (max_font_size - min_font_size) / (max_viewport - min_viewport)
    const YY = (100 * (valMax - valMin)) / (bpMax - bpMin);

    // clamp(min, fluid, max)
    clamps[bpMax] = `clamp(${valMin}px, calc(${remBase}rem + ((1vw - ${XX}px) * ${YY})), ${valMax}px)`;
  }

  return clamps;
}
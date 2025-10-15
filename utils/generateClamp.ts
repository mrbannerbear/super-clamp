export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  const validBps = breakpoints.filter((bp) => typeof values[bp] === "number");

  if (validBps.length < 2) return {};

  const sortedBps = [...validBps].sort((a, b) => b - a); // largest to smallest
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax] as number;
    const valMin = values[bpMin] as number;

    if (typeof valMax !== "number" || typeof valMin !== "number") continue;

    // Determine clamp bounds
    const lower = Math.min(valMin, valMax);
    const upper = Math.max(valMin, valMax);

    // Slope per vw
    const slope = ((valMax - valMin) / (bpMax - bpMin)) * 100;

    // Intercept
    const intercept = valMin - (slope * bpMin) / 100;

    // Rem conversion of lower bound for fluid part
    const remBase = lower / 16;

    clamps[bpMax] = `clamp(${lower}px, calc(${remBase}rem + ((1vw - ${bpMin / 100}px) * ${slope.toFixed(
      4
    )})), ${upper}px)`;
  }

  return clamps;
}

export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  // Only keep breakpoints that actually have a numeric value
  const validBps = breakpoints.filter((bp) => typeof values[bp] === "number");

  // If less than 2 breakpoints have real values, no clamp can be generated
  if (validBps.length < 2) return {};

  const sortedBps = [...validBps].sort((a, b) => b - a);
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax] as number;
    const valMin = values[bpMin] as number;

    // Skip if either value is missing (defensive)
    if (typeof valMax !== "number" || typeof valMin !== "number") continue;

    // slope (per vw) and intercept for the preferred (fluid) value
    const slope = ((valMax - valMin) / (bpMax - bpMin)) * 100;
    const intercept = valMin - (slope * bpMin) / 100;

    // Ensure clamp bounds are ordered (min <= max) to avoid inverted clamp
    const lower = Math.min(valMin, valMax);
    const upper = Math.max(valMin, valMax);

    clamps[bpMax] = `clamp(${lower}px, ${slope.toFixed(
      3
    )}vw + ${intercept.toFixed(3)}px, ${upper}px)`;
  }

  return clamps;
}

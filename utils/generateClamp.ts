export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  // ✅ Only keep breakpoints that actually have a numeric value
  const validBps = breakpoints.filter(
    (bp) => typeof values[bp] === "number"
  );

  // If less than 2 breakpoints have real values, no clamp can be generated
  if (validBps.length < 2) return {};

  const sortedBps = [...validBps].sort((a, b) => b - a);
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax];
    const valMin = values[bpMin];

    // ✅ Skip if either value is missing or invalid
    if (typeof valMax !== "number" || typeof valMin !== "number") continue;

    const slope = ((valMax - valMin) / (bpMax - bpMin)) * 100;
    const intercept = valMin - (slope * bpMin) / 100;

    clamps[bpMax] = `clamp(${valMin}px, ${slope.toFixed(
      3
    )}vw + ${intercept.toFixed(3)}px, ${valMax}px)`;
  }

  return clamps;
}

export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  const sortedBps = [...breakpoints].sort((a, b) => b - a); // descending
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    // Find nearest non-empty numeric values
    let valMax: number | null =
      typeof values[bpMax] === "number" ? values[bpMax] : null;
    let valMin: number | null =
      typeof values[bpMin] === "number" ? values[bpMin] : null;

    if (valMax === null) {
      const nextVal = sortedBps
        .slice(0, i)
        .map((b) => values[b])
        .find((v): v is number => typeof v === "number");
      valMax = nextVal ?? 0;
    }

    if (valMin === null) {
      const nextVal = sortedBps
        .slice(i + 2)
        .map((b) => values[b])
        .find((v): v is number => typeof v === "number");
      valMin = nextVal ?? valMax;
    }

    if (valMax === null || valMin === null) continue;

    const slope = ((valMax - valMin) / (bpMax - bpMin)) * 100;
    const intercept = valMin - (slope * bpMin) / 100;

    clamps[bpMax] = `clamp(${valMin}px, ${slope.toFixed(
      3
    )}vw + ${intercept.toFixed(3)}px, ${valMax}px)`;
  }

  return clamps; // keyed by breakpoint max
}

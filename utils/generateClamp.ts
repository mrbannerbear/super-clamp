export function generateClamp(values: Record<number, number | "">, breakpoints: number[]) {
  const sortedBps = [...breakpoints].sort((a, b) => b - a); // descending
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax];
    const valMin = values[bpMin];

    if (valMax === "" || valMin === "") continue;

    const slope = (valMax - valMin) / (bpMax - bpMin) * 100; // per vw
    const intercept = valMin - (slope * bpMin) / 100;

    clamps[bpMax] = `clamp(${valMin}px, ${slope.toFixed(3)}vw + ${intercept.toFixed(3)}px, ${valMax}px)`;
  }

  return clamps; // keyed by breakpoint max
}

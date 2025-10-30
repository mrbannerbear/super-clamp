export function generateClamp(
  values: Record<number, number | "">,
  breakpoints: number[]
) {
  const validBps = breakpoints.filter((bp) => typeof values[bp] === "number");

  if (validBps.length < 2) return {};

  const sortedBps = [...validBps].sort((a, b) => b - a); // largest → smallest
  const clamps: Record<number, string> = {};

  for (let i = 0; i < sortedBps.length - 1; i++) {
    const bpMax = sortedBps[i];
    const bpMin = sortedBps[i + 1];

    const valMax = values[bpMax] as number;
    const valMin = values[bpMin] as number;

    if (typeof valMax !== "number" || typeof valMin !== "number") continue;

    const lower = Math.min(valMin, valMax);
    const upper = Math.max(valMin, valMax);

    // Calculate slope (YY in the formula)
    const slope = ((valMax - valMin) / (bpMax - bpMin)) * 100;
    
    // Use the MINIMUM viewport's value for remBase (ZZ in the formula)
    const remBase = valMin / 16;
    
    // XX in the formula - this should be the MINIMUM viewport
    const minViewport = bpMin / 100;

    clamps[bpMax] = `clamp(${lower}px, calc(${remBase}rem + ((1vw - ${minViewport}px) * ${slope.toFixed(
      4
    )})), ${upper}px)`;
  }

  // ✅ Add static style for the smallest breakpoint (no clamp)
  const smallestBp = sortedBps[sortedBps.length - 1];
  const smallestVal = values[smallestBp];
  if (typeof smallestVal === "number") {
    clamps[smallestBp] = `${smallestVal}px`;
  }

  return clamps;
}
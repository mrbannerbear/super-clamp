export type Breakpoint = {
  id: string
  label: string
  value: number
}

export const defaultBreakpoints: Breakpoint[] = [
  { id: '1', label: '2560', value: 2560 },
  { id: '2', label: '1920', value: 1920 },
  { id: '3', label: '1280', value: 1280 },
  { id: '4', label: '1024', value: 1024 },
  { id: '5', label: '390', value: 390 },
]

// Utility: sort descending by value
export const sortBreakpoints = (bps: Breakpoint[]) =>
  [...bps].sort((a, b) => b.value - a.value)

// Utility: find the next smaller breakpoint
export const findNextBreakpoint = (bps: Breakpoint[], current: number) => {
  const sorted = sortBreakpoints(bps)
  const index = sorted.findIndex(b => b.value === current)
  return sorted[index + 1] || null
}

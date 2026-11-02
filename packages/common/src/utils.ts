export const clampInt = (value: number, min: number, max: number): number => {
  const intVal = Math.trunc(value);
  return Math.min(Math.max(intVal, min), max);
};

export function coerceInt(val: unknown, def: number, min: number, max: number) {
  let valInt = typeof val === "number" ? val : def;
  if (typeof val === "string") {
    try {
      valInt = parseInt(val);
    } catch {}
  }
  if (!Number.isInteger(valInt)) {
    valInt = def;
  }
  return clampInt(valInt, min, max);
}

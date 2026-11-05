export { findReportsTo } from "./models/employee-node.ts";

export function clamp(number: number, lower: number, upper: number) {
  return Math.min(Math.max(number, lower), upper);
}

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
  return clamp(Math.trunc(valInt), min, max);
}

export function formatUnit(number: string | number) {
  return Number(number).toLocaleString(undefined, {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  });
}

export function formatPercent(number: string | number) {
  return Number(number).toLocaleString(undefined, { style: "percent" });
}

export function formatCurrency(number: string | number, currency: string, compact: boolean) {
  const options: Intl.NumberFormatOptions = { style: "currency", currency };
  if (compact) {
    options.notation = "compact";
  }
  return Number(number).toLocaleString(undefined, options);
}

export function formatUSD(number: number, compact: boolean = false) {
  return formatCurrency(number, "USD", compact);
}

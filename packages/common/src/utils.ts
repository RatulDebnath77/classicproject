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

export function formatCurrency(
  number: string | number,
  currency: string,
  compact: boolean,
  signDisplay: Intl.NumberFormatOptionsSignDisplay,
) {
  const options: Intl.NumberFormatOptions = { style: "currency", currency, signDisplay };
  if (compact) {
    options.notation = "compact";
  }
  return Number(number).toLocaleString(undefined, options);
}

export function formatUSD(
  number: number,
  compact: boolean = false,
  signDisplay: Intl.NumberFormatOptionsSignDisplay = "auto",
) {
  return formatCurrency(number, "USD", compact, signDisplay);
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString();
}

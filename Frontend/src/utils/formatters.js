export const formatNumber = (value, decimals = 2) =>
  Number.isFinite(value) ? value.toFixed(decimals) : "--";

export const formatUnit = (value, unit, decimals = 2) =>
  `${formatNumber(value, decimals)} ${unit}`;

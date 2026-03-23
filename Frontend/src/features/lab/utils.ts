import type { BackendStatus } from "./types";

export const formatLarge = (value: number) =>
  new Intl.NumberFormat("en-US").format(value);

export const linePath = (
  values: number[],
  width: number,
  height: number,
): string => {
  if (values.length === 0) return "";

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  return values
    .map((value, index) => {
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
};

export const statusLabel = (status: BackendStatus): string => {
  if (status === "online") return "Backend Online";
  if (status === "offline") return "Backend Offline";
  return "Checking Backend";
};

export const statusClass = (status: BackendStatus): string => {
  if (status === "online") return "status-pill status-pill-online";
  if (status === "offline") return "status-pill status-pill-offline";
  return "status-pill";
};

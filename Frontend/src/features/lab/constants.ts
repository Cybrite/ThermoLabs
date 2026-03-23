import type { Scenario, SimulationConfig } from "./types";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export const BACKEND_POLL_INTERVAL_MS = 8000;
export const SIMULATION_TICK_MS = 160;

export const DEFAULT_CONFIG: SimulationConfig = {
  inletPressure: 500_000,
  outletPressure: 120_000,
  temperature: 295,
  timeStep: 0.5,
  totalTime: 30,
};

export const QUICK_SCENARIOS: Scenario[] = [
  {
    label: "Cooling Focus",
    values: {
      inletPressure: 620_000,
      outletPressure: 100_000,
      temperature: 302,
      timeStep: 0.5,
      totalTime: 36,
    },
  },
  {
    label: "Rapid Demo",
    values: {
      inletPressure: 450_000,
      outletPressure: 190_000,
      temperature: 290,
      timeStep: 0.25,
      totalTime: 18,
    },
  },
  {
    label: "High Throughput",
    values: {
      inletPressure: 710_000,
      outletPressure: 250_000,
      temperature: 315,
      timeStep: 0.4,
      totalTime: 28,
    },
  },
];

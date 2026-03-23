import type { SimulationConfig, SimulationPoint } from "./types";

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const gaussianNoise = (sigma = 0.05): number => {
  const u1 = 1 - Math.random();
  const u2 = 1 - Math.random();
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return z0 * sigma;
};

export const computeMuJT = (temperature: number, pressure: number): number =>
  (1e-5 * (300 / temperature) * pressure) / 1e5;

export const stepSimulation = (
  point: SimulationPoint,
  config: SimulationConfig,
): SimulationPoint => {
  if (point.time >= config.totalTime) return point;

  let dP =
    (config.outletPressure - point.inletPressure) *
    (config.timeStep / config.totalTime);
  const muJT = computeMuJT(point.temperature, point.inletPressure);
  let dT = muJT * dP;

  dT += gaussianNoise();
  dP += gaussianNoise();

  return {
    time: point.time + config.timeStep,
    inletPressure: point.inletPressure + dP,
    temperature: point.temperature + dT,
    muJT,
  };
};

export const createInitialPoint = (
  config: SimulationConfig,
): SimulationPoint => ({
  time: 0,
  inletPressure: config.inletPressure,
  temperature: config.temperature,
  muJT: computeMuJT(config.temperature, config.inletPressure),
});

export type BackendStatus = "checking" | "online" | "offline";

export type SimulationConfig = {
  inletPressure: number;
  outletPressure: number;
  temperature: number;
  timeStep: number;
  totalTime: number;
};

export type SimulationPoint = {
  time: number;
  inletPressure: number;
  temperature: number;
  muJT: number;
};

export type Scenario = {
  label: string;
  values: SimulationConfig;
};

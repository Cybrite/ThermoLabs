export const LAB_CONFIG = {
  initialState: {
    temperature: 24,
    pressure: 1.2,
    volume: 1.6,
    powerOn: true,
    actionIntensity: 1,
  },
  limits: {
    temperature: { min: -40, max: 220 },
    pressure: { min: 0.2, max: 18 },
    volume: { min: 0.4, max: 3.2 },
    actionIntensity: { min: 0.5, max: 2.5 },
  },
  dynamics: {
    pressureStep: 0.35,
    volumeStep: 0.09,
    jouleThomsonCoefficient: 0.8,
    compressionHeatingFactor: 0.55,
    expansionCoolingFactor: 0.65,
    volumePressureCoupling: 1.15,
  },
};

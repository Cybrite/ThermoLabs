const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const normalize = (value, min, max) => {
  if (max === min) return 0;
  return clamp((value - min) / (max - min), 0, 1);
};

export const clampLabState = (state, limits) => ({
  ...state,
  temperature: clamp(
    state.temperature,
    limits.temperature.min,
    limits.temperature.max,
  ),
  pressure: clamp(state.pressure, limits.pressure.min, limits.pressure.max),
  volume: clamp(state.volume, limits.volume.min, limits.volume.max),
  actionIntensity: clamp(
    state.actionIntensity,
    limits.actionIntensity.min,
    limits.actionIntensity.max,
  ),
});

export const stepCompression = (state, config, intensity = 1) => {
  const { dynamics } = config;
  const deltaPressure = dynamics.pressureStep * intensity;
  const deltaVolume = -dynamics.volumeStep * intensity;
  const deltaTemperature =
    dynamics.compressionHeatingFactor * deltaPressure +
    dynamics.jouleThomsonCoefficient * deltaPressure;

  return {
    ...state,
    pressure: state.pressure + deltaPressure,
    volume: state.volume + deltaVolume,
    temperature: state.temperature + deltaTemperature,
  };
};

export const stepExpansion = (state, config, intensity = 1) => {
  const { dynamics } = config;
  const deltaPressure = dynamics.pressureStep * intensity;
  const deltaVolume = dynamics.volumeStep * intensity;
  const deltaTemperature =
    dynamics.expansionCoolingFactor * deltaPressure +
    dynamics.jouleThomsonCoefficient * deltaPressure;

  return {
    ...state,
    pressure: state.pressure - deltaPressure,
    volume: state.volume + deltaVolume,
    temperature: state.temperature - deltaTemperature,
  };
};

export const setVolumeByDrag = (state, config, targetVolume) => {
  const { dynamics } = config;
  const volumeDelta = targetVolume - state.volume;
  const pressureDelta = -volumeDelta * dynamics.volumePressureCoupling;
  const temperatureDelta =
    dynamics.jouleThomsonCoefficient * pressureDelta * 0.6;

  return {
    ...state,
    volume: targetVolume,
    pressure: state.pressure + pressureDelta,
    temperature: state.temperature + temperatureDelta,
  };
};

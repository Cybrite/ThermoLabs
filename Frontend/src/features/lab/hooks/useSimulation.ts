import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_CONFIG,
  QUICK_SCENARIOS,
  SIMULATION_TICK_MS,
} from "../constants";
import { clamp, createInitialPoint, stepSimulation } from "../simulation";
import type { SimulationConfig, SimulationPoint } from "../types";

export const useSimulation = () => {
  const [simulationConfig, setSimulationConfig] =
    useState<SimulationConfig>(DEFAULT_CONFIG);
  const [history, setHistory] = useState<SimulationPoint[]>([
    createInitialPoint(DEFAULT_CONFIG),
  ]);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = null;
      return;
    }

    timerRef.current = window.setInterval(() => {
      setHistory((previous) => {
        const currentPoint = previous[previous.length - 1];

        if (currentPoint.time >= simulationConfig.totalTime) {
          setIsRunning(false);
          return previous;
        }

        const nextPoint = stepSimulation(currentPoint, simulationConfig);
        return [...previous, nextPoint];
      });
    }, SIMULATION_TICK_MS);

    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = null;
    };
  }, [isRunning, simulationConfig]);

  const latestPoint = history[history.length - 1];
  const temperatureSeries = history.map((point) => point.temperature);
  const pressureSeries = history.map((point) => point.inletPressure);

  const timelinePercent = useMemo(
    () => clamp((latestPoint.time / simulationConfig.totalTime) * 100, 0, 100),
    [latestPoint.time, simulationConfig.totalTime],
  );

  const thermalPercent = useMemo(() => {
    const minT = 240;
    const maxT = 380;
    return clamp(
      ((latestPoint.temperature - minT) / (maxT - minT)) * 100,
      0,
      100,
    );
  }, [latestPoint.temperature]);

  const inletPressurePercent = useMemo(() => {
    const maxP = Math.max(
      simulationConfig.inletPressure,
      simulationConfig.outletPressure,
      1,
    );
    return clamp((latestPoint.inletPressure / maxP) * 100, 0, 100);
  }, [
    latestPoint.inletPressure,
    simulationConfig.inletPressure,
    simulationConfig.outletPressure,
  ]);

  const outletPressurePercent = useMemo(() => {
    const maxP = Math.max(
      simulationConfig.inletPressure,
      simulationConfig.outletPressure,
      1,
    );
    return clamp((simulationConfig.outletPressure / maxP) * 100, 0, 100);
  }, [simulationConfig.inletPressure, simulationConfig.outletPressure]);

  const updateConfig = (field: keyof SimulationConfig, value: number) => {
    setSimulationConfig((previous) => {
      const nextConfig = { ...previous, [field]: value };
      setHistory([createInitialPoint(nextConfig)]);
      return nextConfig;
    });
    setIsRunning(false);
  };

  const resetSimulation = (nextConfig = simulationConfig) => {
    setIsRunning(false);
    setHistory([createInitialPoint(nextConfig)]);
  };

  const runSingleStep = () => {
    setIsRunning(false);
    setHistory((previous) => {
      const current = previous[previous.length - 1];
      if (current.time >= simulationConfig.totalTime) return previous;
      return [...previous, stepSimulation(current, simulationConfig)];
    });
  };

  const applyScenario = (nextConfig: SimulationConfig) => {
    setSimulationConfig(nextConfig);
    resetSimulation(nextConfig);
  };

  return {
    simulationConfig,
    isRunning,
    setIsRunning,
    history,
    latestPoint,
    temperatureSeries,
    pressureSeries,
    timelinePercent,
    thermalPercent,
    inletPressurePercent,
    outletPressurePercent,
    updateConfig,
    resetSimulation,
    runSingleStep,
    applyScenario,
    quickScenarios: QUICK_SCENARIOS,
  };
};

import { createContext, useCallback, useContext, useMemo } from "react";
import { useJTSocket } from "../hooks/useJTSocket";
import { LAB_CONFIG } from "../config/labConfig";

const LabContext = createContext(null);

/* ── pressure step for compress / expand buttons (Pa) ─────── */
const PRESSURE_STEP = 50_000; // 0.5 bar per click
const MIN_PRESSURE = 50_000; // 0.5 bar floor
const MAX_PRESSURE = 2_000_000; // 20 bar ceiling

export const LabProvider = ({ children }) => {
  const ws = useJTSocket();

  /* ── actions: left compressor controls P1, right controls P2 ── */
  const compressLeft = useCallback(() => {
    const newP1 = Math.min(ws.P1 + PRESSURE_STEP, MAX_PRESSURE);
    if (newP1 <= ws.P2) return; // P1 must stay > P2
    if (ws.isRunning) {
      ws.updatePressures(newP1, ws.P2);
    } else {
      ws.startSimulation(newP1, ws.P2);
    }
  }, [ws]);

  const expandLeft = useCallback(() => {
    const newP1 = Math.max(ws.P1 - PRESSURE_STEP, MIN_PRESSURE);
    if (newP1 <= ws.P2) return;
    if (ws.isRunning) {
      ws.updatePressures(newP1, ws.P2);
    } else {
      ws.startSimulation(newP1, ws.P2);
    }
  }, [ws]);

  const compressRight = useCallback(() => {
    const newP2 = Math.min(ws.P2 + PRESSURE_STEP, MAX_PRESSURE);
    if (ws.P1 <= newP2) return; // P1 must stay > P2
    if (ws.isRunning) {
      ws.updatePressures(ws.P1, newP2);
    } else {
      ws.startSimulation(ws.P1, newP2);
    }
  }, [ws]);

  const expandRight = useCallback(() => {
    const newP2 = Math.max(ws.P2 - PRESSURE_STEP, MIN_PRESSURE);
    if (ws.P1 <= newP2) return;
    if (ws.isRunning) {
      ws.updatePressures(ws.P1, newP2);
    } else {
      ws.startSimulation(ws.P1, newP2);
    }
  }, [ws]);

  /* ── set pressures from typed input (Pa) ─────────────────── */
  const setPressures = useCallback((p1Pa, p2Pa) => {
    const p1 = Math.max(MIN_PRESSURE, Math.min(MAX_PRESSURE, p1Pa));
    const p2 = Math.max(MIN_PRESSURE, Math.min(MAX_PRESSURE, p2Pa));
    if (p1 <= p2) return; // P1 must be > P2
    if (ws.isRunning) {
      ws.updatePressures(p1, p2);
    } else {
      ws.startSimulation(p1, p2);
    }
  }, [ws]);

  /* ── map live data into the shape the components expect ───── */
  const p1Bar = ws.P1 / 100_000;
  const p2Bar = ws.P2 / 100_000;
  const pLimits = LAB_CONFIG.limits.pressure;
  const tLimits = LAB_CONFIG.limits.temperature;

  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const normalize = (v, lo, hi) =>
    hi <= lo ? 0 : clamp((v - lo) / (hi - lo), 0, 1);

  const leftTemp = ws.liveTemperatureC;
  /* Outlet side is cooler — Joule-Thomson cooling */
  const thermalDrop =
    ((ws.P1 - ws.P2) / Math.max(ws.P1, 1)) * 12;
  const rightTemp = ws.liveTemperatureC - thermalDrop;

  const state = {
    pressure: p1Bar,
    temperature: ws.liveTemperatureC,
    volume: 1.6, // visual placeholder
    powerOn: ws.connected,
    actionIntensity: 1,

    /* new split values */
    p1: p1Bar,
    p2: p2Bar,
    p1Pa: ws.P1,
    p2Pa: ws.P2,
    leftTemp,
    rightTemp,
    liveTemperatureK: ws.liveTemperatureK,
    livePressurePa: ws.livePressurePa,
    livePressureBar: ws.livePressureBar,
    liveTemperatureC: ws.liveTemperatureC,

    /* volume ratios for chamber animation */
    volumeRatioLeft: ws.volumeRatioLeft,
    volumeRatioRight: ws.volumeRatioRight,

    /* simulation status */
    connected: ws.connected,
    isRunning: ws.isRunning,
    isComplete: ws.isComplete,
    packetNumber: ws.packetNumber,
    totalPackets: ws.totalPackets,
    elapsedSimTime: ws.elapsedSimTime,
    latestDataPoints: ws.latestDataPoints,
    error: ws.error,
  };

  const derived = useMemo(() => {
    return {
      pressureRatio: normalize(p1Bar, pLimits.min, pLimits.max),
      temperatureRatio: normalize(
        ws.liveTemperatureC,
        tLimits.min,
        tLimits.max,
      ),
      volumeRatio: ws.volumeRatioLeft,
      p1Ratio: normalize(p1Bar, pLimits.min, pLimits.max),
      p2Ratio: normalize(p2Bar, pLimits.min, pLimits.max),
      leftTempRatio: normalize(leftTemp, tLimits.min, tLimits.max),
      rightTempRatio: normalize(rightTemp, tLimits.min, tLimits.max),
    };
  }, [p1Bar, p2Bar, ws.liveTemperatureC, leftTemp, rightTemp, ws.volumeRatioLeft, pLimits, tLimits]);

  const actions = useMemo(
    () => ({
      compressLeft,
      expandLeft,
      compressRight,
      expandRight,
      setPressures,
      startSimulation: ws.startSimulation,
      stopSimulation: ws.stopSimulation,
      /* Keep legacy actions pointing at P1 for backward compat */
      compressGas: compressLeft,
      expandGas: expandLeft,
      resetSystem: ws.stopSimulation,
      setVolume: () => {},
      setIntensity: () => {},
      togglePower: () => {},
    }),
    [compressLeft, expandLeft, compressRight, expandRight, setPressures, ws.startSimulation, ws.stopSimulation],
  );

  const api = useMemo(
    () => ({ state, config: LAB_CONFIG, derived, actions }),
    [state, derived, actions],
  );

  return <LabContext.Provider value={api}>{children}</LabContext.Provider>;
};

export const useLabContext = () => {
  const context = useContext(LabContext);
  if (!context) {
    throw new Error("useLabContext must be used inside LabProvider");
  }
  return context;
};

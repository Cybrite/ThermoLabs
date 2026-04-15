import { useCallback, useEffect, useRef, useState } from "react";
import { getSocket, destroySocket } from "../services/socketService";

/* ── unit helpers ───────────────────────────────────────────── */
const paToBar = (pa) => pa / 100_000;
const kelvinToCelsius = (k) => k - 273.15;

/* ── initial hook state ────────────────────────────────────── */
const INITIAL_STATE = {
  connected: false,
  isRunning: false,
  isComplete: false,

  /* Pressures the user sets (Pa) */
  P1: 500_000,
  P2: 100_000,

  /* Latest values from backend */
  liveTemperatureK: 300,
  livePressurePa: 500_000,

  /* Converted for display */
  liveTemperatureC: 26.85,
  livePressureBar: 5,

  /* Derived volumes (relative, 0-1 scale for visuals) */
  volumeRatioLeft: 0.5,
  volumeRatioRight: 0.5,

  /* Packet tracking */
  packetNumber: 0,
  totalPackets: 720,
  elapsedSimTime: 0,

  /* Latest full packet (5 data points) */
  latestDataPoints: [],

  /* Error */
  error: null,
};

/**
 * React hook that manages the full Socket.IO lifecycle for the
 * Joule-Thomson simulation.
 */
export const useJTSocket = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const socketRef = useRef(null);
  const runningRef = useRef(false);

  /* ── connect / disconnect ─────────────────────────────────── */
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) socket.connect();

    const onConnect = () =>
      setState((s) => ({ ...s, connected: true, error: null }));

    const onDisconnect = () =>
      setState((s) => ({ ...s, connected: false }));

    const onData = (data) => {
      const last = data.dataPoints[data.dataPoints.length - 1];
      if (!last) return;

      /* derive relative volume from pressures — V ∝ 1/P */
      const p1 = data.inputParams.P1;
      const p2 = data.inputParams.P2;
      const maxP = Math.max(p1, p2, 1);
      const vLeft = 1 - p1 / (maxP * 1.5);
      const vRight = 1 - p2 / (maxP * 1.5);

      setState((s) => ({
        ...s,
        liveTemperatureK: last.temperature,
        livePressurePa: last.pressure,
        liveTemperatureC: kelvinToCelsius(last.temperature),
        livePressureBar: paToBar(last.pressure),
        P1: data.inputParams.P1,
        P2: data.inputParams.P2,
        packetNumber: data.packetNumber,
        totalPackets: data.totalPackets,
        elapsedSimTime: data.elapsedSimTime,
        latestDataPoints: data.dataPoints,
        volumeRatioLeft: Math.max(0.15, Math.min(0.85, 0.5 + (vLeft - 0.33))),
        volumeRatioRight: Math.max(0.15, Math.min(0.85, 0.5 + (vRight - 0.33))),
      }));
    };

    const onUpdated = (data) => {
      setState((s) => ({
        ...s,
        P1: data.newParams.P1,
        P2: data.newParams.P2,
      }));
    };

    const onComplete = () => {
      runningRef.current = false;
      setState((s) => ({
        ...s,
        isRunning: false,
        isComplete: true,
      }));
    };

    const onStopped = () => {
      runningRef.current = false;
      setState((s) => ({
        ...s,
        isRunning: false,
        isComplete: false,
      }));
    };

    const onError = (data) => {
      setState((s) => ({ ...s, error: data.message }));
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("jt:data", onData);
    socket.on("jt:updated", onUpdated);
    socket.on("jt:complete", onComplete);
    socket.on("jt:stopped", onStopped);
    socket.on("jt:error", onError);

    /* If the socket was already connected before the effect ran */
    if (socket.connected) onConnect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("jt:data", onData);
      socket.off("jt:updated", onUpdated);
      socket.off("jt:complete", onComplete);
      socket.off("jt:stopped", onStopped);
      socket.off("jt:error", onError);
      destroySocket();
    };
  }, []);

  /* ── actions ──────────────────────────────────────────────── */
  const startSimulation = useCallback((p1, p2) => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    socket.emit("jt:start", { P1: p1, P2: p2 });
    runningRef.current = true;
    setState((s) => ({
      ...s,
      isRunning: true,
      isComplete: false,
      P1: p1,
      P2: p2,
      packetNumber: 0,
      elapsedSimTime: 0,
      error: null,
    }));
  }, []);

  const updatePressures = useCallback((p1, p2) => {
    const socket = socketRef.current;
    if (!socket?.connected || !runningRef.current) return;

    socket.emit("jt:update", { P1: p1, P2: p2 });
    setState((s) => ({ ...s, P1: p1, P2: p2, error: null }));
  }, []);

  const stopSimulation = useCallback(() => {
    const socket = socketRef.current;
    if (!socket?.connected) return;

    socket.emit("jt:stop");
    runningRef.current = false;
    setState((s) => ({ ...s, isRunning: false }));
  }, []);

  return {
    ...state,
    startSimulation,
    updatePressures,
    stopSimulation,
  };
};

/**
 * WebSocket handler for real-time Joule-Thomson simulation.
 *
 * Events:
 *   jt:start   { P1, P2 }   — start a new simulation session
 *   jt:update  { P1, P2 }   — change pressures mid-session (timer continues)
 *   jt:stop                  — abort the session early
 *
 * Emissions:
 *   jt:data     { packetNumber, totalPackets, elapsedSimTime, inputParams, dataPoints }
 *   jt:complete { finalState }
 *   jt:error    { message }
 */

import { JTSimulation } from "../simulation/jt-simulation.js";

const PACKET_INTERVAL_MS = 5000; // send a packet every 5 real-time seconds
const TOTAL_PACKETS = 180;       // 900s / 5 data-points per packet

/**
 * Register JT simulation events on a Socket.IO server instance.
 * @param {import("socket.io").Server} io
 */
export function registerJTSocket(io) {
    io.on("connection", (socket) => {
        console.log(`[JT-WS] Client connected: ${socket.id}`);

        /** Per-connection simulation state */
        let simulation = null;
        let intervalId = null;
        let packetNumber = 0;

        // ────────────────────────────────────────────
        //  jt:start  —  Begin a new simulation
        // ────────────────────────────────────────────
        socket.on("jt:start", (payload) => {
            const { P1, P2 } = payload || {};

            if (P1 == null || P2 == null) {
                return socket.emit("jt:error", {
                    message: "Missing required parameters. Provide P1 and P2.",
                });
            }

            if (typeof P1 !== "number" || typeof P2 !== "number") {
                return socket.emit("jt:error", {
                    message: "P1 and P2 must be numbers.",
                });
            }

            if (P1 <= P2) {
                return socket.emit("jt:error", {
                    message: "P1 must be greater than P2 (inlet > outlet).",
                });
            }

            // Clean up any existing session
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            simulation = new JTSimulation(P1, P2);
            packetNumber = 0;

            console.log(`[JT-WS] Simulation started for ${socket.id} | P1=${P1}, P2=${P2}`);

            // Emit data packets every 5 seconds
            intervalId = setInterval(() => {
                if (!simulation || simulation.isComplete) {
                    clearInterval(intervalId);
                    intervalId = null;
                    socket.emit("jt:complete", {
                        finalState: simulation ? simulation.getFinalState() : null,
                    });
                    console.log(`[JT-WS] Simulation complete for ${socket.id}`);
                    return;
                }

                packetNumber++;
                const { dataPoints, done } = simulation.generatePacket();

                socket.emit("jt:data", {
                    packetNumber,
                    totalPackets: TOTAL_PACKETS,
                    elapsedSimTime: simulation.getFinalState().time,
                    inputParams: { P1: simulation.P1, P2: simulation.P2 },
                    dataPoints,
                });

                if (done) {
                    clearInterval(intervalId);
                    intervalId = null;
                    socket.emit("jt:complete", {
                        finalState: simulation.getFinalState(),
                    });
                    console.log(`[JT-WS] Simulation complete for ${socket.id}`);
                }
            }, PACKET_INTERVAL_MS);
        });

        // ────────────────────────────────────────────
        //  jt:update  —  Change P1/P2 mid-session
        // ────────────────────────────────────────────
        socket.on("jt:update", (payload) => {
            const { P1, P2 } = payload || {};

            if (!simulation) {
                return socket.emit("jt:error", {
                    message: "No active simulation. Send jt:start first.",
                });
            }

            if (P1 == null || P2 == null) {
                return socket.emit("jt:error", {
                    message: "Missing required parameters. Provide P1 and P2.",
                });
            }

            if (typeof P1 !== "number" || typeof P2 !== "number") {
                return socket.emit("jt:error", {
                    message: "P1 and P2 must be numbers.",
                });
            }

            if (P1 <= P2) {
                return socket.emit("jt:error", {
                    message: "P1 must be greater than P2 (inlet > outlet).",
                });
            }

            simulation.updatePressures(P1, P2);
            console.log(`[JT-WS] Pressures updated for ${socket.id} | P1=${P1}, P2=${P2}`);

            socket.emit("jt:updated", {
                message: "Pressures updated. Changes will reflect in next data packet.",
                newParams: { P1, P2 },
                currentSimTime: simulation.getFinalState().time,
            });
        });

        // ────────────────────────────────────────────
        //  jt:stop  —  Abort simulation early
        // ────────────────────────────────────────────
        socket.on("jt:stop", () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }

            const finalState = simulation ? simulation.getFinalState() : null;
            simulation = null;
            packetNumber = 0;

            socket.emit("jt:stopped", {
                message: "Simulation stopped.",
                finalState,
            });
            console.log(`[JT-WS] Simulation stopped by ${socket.id}`);
        });

        // ────────────────────────────────────────────
        //  disconnect  —  Clean up
        // ────────────────────────────────────────────
        socket.on("disconnect", () => {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            simulation = null;
            console.log(`[JT-WS] Client disconnected: ${socket.id}`);
        });
    });
}

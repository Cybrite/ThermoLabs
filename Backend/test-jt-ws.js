/**
 * Quick test script for the JT WebSocket simulation.
 * Run: node test-jt-ws.js
 */
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);

    // Start simulation with P1=500000, P2=100000
    console.log("\n📡 Sending jt:start with P1=500000, P2=100000");
    socket.emit("jt:start", { P1: 500000, P2: 100000 });
});

let packetCount = 0;

socket.on("jt:data", (data) => {
    packetCount++;
    console.log(`\n📦 Packet #${data.packetNumber} (sim time: ${data.elapsedSimTime}s)`);
    console.log(`   Input: P1=${data.inputParams.P1}, P2=${data.inputParams.P2}`);
    data.dataPoints.forEach((pt) => {
        console.log(`   t=${pt.time}s  P=${pt.pressure.toFixed(2)} Pa  T=${pt.temperature.toFixed(4)} K`);
    });

    // After 2 packets, update P1/P2
    if (packetCount === 2) {
        console.log("\n🔄 Updating pressures: P1=800000, P2=200000");
        socket.emit("jt:update", { P1: 800000, P2: 200000 });
    }

    // After 4 packets, stop simulation
    if (packetCount === 4) {
        console.log("\n🛑 Stopping simulation after 4 packets");
        socket.emit("jt:stop");
    }
});

socket.on("jt:updated", (data) => {
    console.log(`\n✅ Pressures updated: ${JSON.stringify(data.newParams)} at sim time ${data.currentSimTime}s`);
});

socket.on("jt:stopped", (data) => {
    console.log("\n🛑 Simulation stopped:", JSON.stringify(data.finalState));
    socket.disconnect();
});

socket.on("jt:complete", (data) => {
    console.log("\n🏁 Simulation complete:", JSON.stringify(data.finalState));
    socket.disconnect();
});

socket.on("jt:error", (data) => {
    console.error("\n❌ Error:", data.message);
});

socket.on("disconnect", () => {
    console.log("\n👋 Disconnected");
    process.exit(0);
});

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import { registerJTSocket } from "./websockets/jt-socket.js";
import simulationRouter from "./routes/simulations.routes.js";
import authRouter from "./routes/auth.routes.js";
import { initDb } from "./db/init.js";

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN || true,
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/auth", authRouter);
app.use(simulationRouter);

// Create HTTP server and attach Socket.IO
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
});

// Register WebSocket handlers
registerJTSocket(io);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await initDb();
    httpServer.listen(PORT, () => {
      console.log(`Server running on port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize server:", error);
    process.exit(1);
  }
};

startServer();

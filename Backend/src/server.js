import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

import router from "./routes/simulations.routes.js";
app.use(router);

app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port: ${process.env.PORT || 8000}`);
});
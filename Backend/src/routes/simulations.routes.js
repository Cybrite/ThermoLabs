import { Router } from "express";
import { helloTest } from "../controllers/simulations.controllers.js";

const router = Router();

// Hello test — compiles & runs hello.cpp, prints "hello" x times
// Body: { x }
router.route("/simulate/hello").post(helloTest);

// Joule-Thomson simulation is now handled via WebSocket (see websockets/jt-socket.js)

export default router;
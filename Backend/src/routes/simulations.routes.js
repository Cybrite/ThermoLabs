import { Router } from "express";
import { simulateJT, helloTest } from "../controllers/simulations.controllers.js";

const router = Router();

// Hello test — compiles & runs hello.cpp, prints "hello" x times
// Body: { x }
router.route("/simulate/hello").post(helloTest);

// Joule-Thomson simulation — compiles & runs main.cpp + joule_thompson.cpp
// Body: { P1, P2, T, dt, totalTime }
router.route("/simulate/jt").post(simulateJT);

export default router;
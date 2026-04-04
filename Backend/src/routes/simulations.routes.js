import { Router } from "express";
import {
    testRoute,
    cpptest,
    simulateJT,
    helloTest,
} from "../controllers/simulations.controllers.js";

const router = Router();

// Health check / test
router.route("/testRoute").get(testRoute);

// Legacy C++ test route (backward compatible)
router.route("/cpptest").post(cpptest);

// Joule-Thomson simulation — compiles & runs main.cpp + joule_thompson.cpp
// Body: { P1, P2, T, dt, totalTime }
router.route("/simulate/jt").post(simulateJT);

// Hello test — compiles & runs hello.cpp, prints "hello" x times
// Body: { x }
router.route("/simulate/hello").post(helloTest);

export default router;
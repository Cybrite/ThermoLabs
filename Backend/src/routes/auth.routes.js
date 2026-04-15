import { Router } from "express";
import { login, me, signup } from "../controllers/auth.controllers.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.get("/me", requireAuth, me);

export default authRouter;

import { Router } from "express";
import * as SessionController from "../controllers/SessionController";
import * as UserController from "../controllers/UserController";
import isAuth from "../middleware/isAuth";
import envTokenAuth from "../middleware/envTokenAuth";
import { loginRateLimiter } from "../middleware/rateLimiter";

const authRoutes = Router();

authRoutes.post("/signup", envTokenAuth, UserController.store);
authRoutes.post("/login", loginRateLimiter, SessionController.store); // Rate limit: 5/min por IP
authRoutes.post("/refresh_token", SessionController.update);
authRoutes.delete("/logout", isAuth, SessionController.remove);
authRoutes.get("/me", isAuth, SessionController.me);

export default authRoutes;


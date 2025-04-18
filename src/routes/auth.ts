import express from "express";
import { AuthController } from "../controllers/AuthController";

const router = express.Router();
const controller = new AuthController();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.get("/verify", controller.verifyToken);

export default router;

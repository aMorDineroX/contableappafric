import express from "express";
import { TransactionController } from "../controllers/TransactionController";

const router = express.Router();
const controller = new TransactionController();

router.get("/", controller.getAll);
router.post("/", controller.create);

export default router;

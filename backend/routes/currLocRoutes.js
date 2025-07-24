import express from "express";
import { getCurrLocation } from "../controllers/currLocationController.js";

const router = express.Router();

router.get("/", getCurrLocation);

export default router;

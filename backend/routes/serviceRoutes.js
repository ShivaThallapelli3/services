import express from "express";
import { getNearbyServices } from "../controllers/serviceController.js";

const router = express.Router();

router.get("/nearby", getNearbyServices);

export default router;

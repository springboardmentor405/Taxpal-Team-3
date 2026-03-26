import express from "express";
import { calculateTax } from "../controllers/taxController.js";

const router = express.Router();

router.post("/calculate", calculateTax);

export default router;
// src/routes/mpesa.js
import express from "express";
import { simulateMpesaPayment } from "../services/mpesaMock.js";

const router = express.Router();

// 📱 Simulate payment endpoint
router.post("/pay/:billId", async (req, res) => {
  try {
    const result = await simulateMpesaPayment(req.params.billId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

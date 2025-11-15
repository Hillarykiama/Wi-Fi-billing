// routes/bills.js
import express from "express";
import db from "../db/db.js";
import { activateInternet, deactivateInternet } from "../src/services/mikrotikMock.js";
import { simulateSTKPush } from "../src/services/mpesaMock.js";

const router = express.Router();

/**
 * 🧾 Get all bills
 * Example: GET /api/bills
 */
router.get("/", async (req, res) => {
  try {
    const bills = await db.all("SELECT * FROM bills ORDER BY created_at DESC");
    res.json(bills);
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

/**
 * 💰 Pay a bill (triggers mock M-Pesa)
 * Example: POST /api/bills/pay
 * Body: { billId, phone, amount }
 */
router.post("/pay", async (req, res) => {
  try {
    const { billId, phone, amount } = req.body;

    if (!billId || !phone || !amount) {
      return res.status(400).json({ error: "Missing billId, phone, or amount" });
    }

    // Generate mock transaction ID
    const transactionId = `TX${Date.now()}`;

    // Log to DB
    await db.run(
      `INSERT INTO payments (bill_id, phone, amount, transaction_id, status, created_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'))`,
      [billId, phone, amount, transactionId, "PENDING"]
    );

    // Trigger mock M-Pesa STK Push
    const stkResult = await simulateSTKPush({ phone, amount, transactionId });

    res.json({
      message: "Payment initiated. Awaiting confirmation.",
      stkResult,
    });
  } catch (err) {
    console.error("Error initiating payment:", err);
    res.status(500).json({ error: "Failed to initiate payment" });
  }
});

/**
 * 🔌 Activate Internet
 * Example: POST /api/bills/activate
 * Body: { deviceId, actionId }
 */
router.post("/activate", async (req, res) => {
  try {
    const { deviceId, actionId } = req.body;

    if (!deviceId || !actionId) {
      return res.status(400).json({ error: "Missing deviceId or actionId" });
    }

    const result = await activateInternet({ deviceId, actionId });
    res.json(result);
  } catch (err) {
    console.error("Error activating internet:", err);
    res.status(500).json({ error: "Failed to activate internet" });
  }
});

/**
 * 📴 Deactivate Internet
 * Example: POST /api/bills/deactivate
 * Body: { deviceId, actionId }
 */
router.post("/deactivate", async (req, res) => {
  try {
    const { deviceId, actionId } = req.body;

    if (!deviceId || !actionId) {
      return res.status(400).json({ error: "Missing deviceId or actionId" });
    }

    const result = await deactivateInternet({ deviceId, actionId });
    res.json(result);
  } catch (err) {
    console.error("Error deactivating internet:", err);
    res.status(500).json({ error: "Failed to deactivate internet" });
  }
});

export default router;















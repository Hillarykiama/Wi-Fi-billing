import express from "express";
import db from "../../db/db.js"; // ✅ Correct path to your database
import { simulateSTKPush } from "../services/mpesamock.js"; // ✅ Corrected path

const router = express.Router();

/**
 * INITIATE M-PESA STK PUSH (MOCK)
 * --------------------------------
 * Expected request body:
 * {
 *   "phone": "2547XXXXXXXX",
 *   "amount": 100
 * }
 */
router.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: "Phone and amount are required" });
    }

    // Save the initial transaction record
    const result = await db.run(
      `INSERT INTO transactions (phone, amount, status, created_at)
       VALUES (?, ?, ?, datetime('now'))`,
      [phone, amount, "PENDING"]
    );

    const transactionId = result.lastID;

    // Simulate M-Pesa STK Push (mocked)
    const mockResponse = await simulateSTKPush({ phone, amount, transactionId });

    res.json({
      message: "STK Push initiated (mock)",
      transactionId,
      mockResponse,
    });
  } catch (error) {
    console.error("❌ Error initiating STK push:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * HANDLE M-PESA CALLBACK (MOCK)
 * ------------------------------
 * This simulates M-Pesa's callback to your backend.
 */
router.post("/callback", async (req, res) => {
  try {
    const { transactionId, resultCode, resultDesc } = req.body;

    if (!transactionId) {
      return res.status(400).json({ error: "Missing transactionId" });
    }

    const status = resultCode === 0 ? "SUCCESS" : "FAILED";

    await db.run(
      `UPDATE transactions
       SET status = ?, result_desc = ?, updated_at = datetime('now')
       WHERE id = ?`,
      [status, resultDesc || "Mock callback received", transactionId]
    );

    console.log(`✅ Transaction ${transactionId} updated to ${status}`);

    res.json({ message: "Callback processed", transactionId, status });
  } catch (error) {
    console.error("❌ Error processing callback:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * FETCH ALL TRANSACTIONS
 * -----------------------
 * For admin panel or debugging.
 */
router.get("/transactions", async (req, res) => {
  try {
    const rows = await db.all("SELECT * FROM transactions ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;






import express from "express";
import { getDb } from "../src/models/db.js";
import { simulateMpesaPayment } from "../src/services/mpesaMock.js";
import { simulateMikrotikActivation } from "../src/services/mikrotikMock.js";

const router = express.Router();

// ✅ Fetch all bills with customer names
router.get("/", async (req, res) => {
  try {
    const db = await getDb();
    const bills = await db.all(`
      SELECT b.*, c.name AS customer_name
      FROM bills b
      JOIN customers c ON b.customer_id = c.id
    `);
    res.json(bills);
  } catch (error) {
    console.error("❌ Failed to fetch bills:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ✅ Simulate M-Pesa payment and Mikrotik activation
router.post("/:id/pay", async (req, res) => {
  const { id } = req.params;
  try {
    const db = await getDb();

    // Fetch bill with joined customer name
    const bill = await db.get(
      `SELECT b.*, c.name AS customer_name
       FROM bills b
       JOIN customers c ON b.customer_id = c.id
       WHERE b.id = ?`,
      [id]
    );

    if (!bill) {
      console.error("❌ Bill not found:", id);
      return res.status(404).json({ error: "Bill not found" });
    }

    // 🔧 Ensure we always have the customer name
    const customerName = bill.customer_name || (
      await db.get("SELECT name FROM customers WHERE id = ?", [bill.customer_id])
    )?.name;

    // 2️⃣ Check if already paid
    if (bill.status === "paid") {
      console.log(`⚠️ Bill ${id} already marked as paid`);
      return res.json({
        payment: {
          message: `Bill ${bill.id} is already marked as paid for ${customerName}`,
          billId: bill.id,
          amount: bill.amount,
          status: bill.status,
        },
        activation: {
          message: `Internet activated for ${customerName}`,
          customerId: bill.customer_id,
          status: "active",
        },
      });
    }

    // 3️⃣ Simulate M-Pesa payment
    const payment = await simulateMpesaPayment(bill);

    // 4️⃣ Update bill to "paid"
    await db.run("UPDATE bills SET status = ? WHERE id = ?", ["paid", id]);

    // 5️⃣ Simulate Mikrotik activation
    const activation = await simulateMikrotikActivation(bill);

    console.log("✅ Payment and activation completed for:", customerName);
    res.json({ payment, activation });
  } catch (error) {
    console.error("❌ Payment or activation failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;








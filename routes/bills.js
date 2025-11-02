import express from "express";
import dbPromise from "../src/models/db.js";

const router = express.Router();

// 📘 Get all bills
router.get("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const bills = await db.all("SELECT * FROM bills");
    res.json(bills);
  } catch (error) {
    console.error("Error fetching bills:", error);
    res.status(500).json({ error: "Failed to fetch bills" });
  }
});

// 📘 Get a single bill by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const bill = await db.get("SELECT * FROM bills WHERE id = ?", [req.params.id]);

    if (!bill) return res.status(404).json({ error: "Bill not found" });
    res.json(bill);
  } catch (error) {
    console.error("Error fetching bill:", error);
    res.status(500).json({ error: "Failed to fetch bill" });
  }
});

// 💳 Pay a bill
router.post("/:id/pay", async (req, res) => {
  try {
    const db = await dbPromise;
    const { id } = req.params;

    // Check if bill exists
    const bill = await db.get("SELECT * FROM bills WHERE id = ?", [id]);
    if (!bill) {
      return res.status(404).json({ error: "Bill not found" });
    }

    // Update bill status to 'paid'
    await db.run("UPDATE bills SET status = 'paid' WHERE id = ?", [id]);

    // Fetch updated bill
    const updatedBill = await db.get("SELECT * FROM bills WHERE id = ?", [id]);

    console.log(`✅ Internet activated for ${updatedBill.customer_name}`);
    res.json({
      message: `✅ Internet activated for ${updatedBill.customer_name}`,
      bill: updatedBill,
    });
  } catch (error) {
    console.error("Error updating bill status:", error);
    res.status(500).json({ error: "Failed to update bill status" });
  }
});

// 🧾 Create a new bill
router.post("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const { customer_name, amount, due_date } = req.body;

    if (!customer_name || !amount || !due_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    await db.run(
      "INSERT INTO bills (customer_name, amount, due_date, status) VALUES (?, ?, ?, 'unpaid')",
      [customer_name, amount, due_date]
    );

    res.json({ message: "Bill added successfully" });
  } catch (error) {
    console.error("Error creating bill:", error);
    res.status(500).json({ error: "Failed to create bill" });
  }
});

export default router;









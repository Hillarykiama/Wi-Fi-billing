// src/controllers/billsController.js
import db from "../models/db.js";

// ✅ Get all bills with customer name
export const getAllBills = async (req, res) => {
  try {
    const bills = await db.all(`
      SELECT bills.*, customers.name AS customer_name
      FROM bills
      JOIN customers ON bills.customer_id = customers.id
      ORDER BY bills.id DESC
    `);
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Create a new bill
export const addBill = async (req, res) => {
  const { customer_id, amount, plan, due_date, status } = req.body;
  try {
    const result = await db.run(
      `INSERT INTO bills (customer_id, amount, plan, due_date, status)
       VALUES (?, ?, ?, ?, ?)`,
      [customer_id, amount, plan, due_date, status || "unpaid"]
    );
    res.json({ id: result.lastID, message: "Bill created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Mark bill as paid
export const markBillAsPaid = async (req, res) => {
  try {
    await db.run("UPDATE bills SET status = 'paid' WHERE id = ?", [
      req.params.id,
    ]);
    res.json({ message: "Bill marked as paid" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

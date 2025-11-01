// src/controllers/customersController.js
import db from "../models/db.js";

// ✅ Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await db.all("SELECT * FROM customers ORDER BY id DESC");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ➕ Add new customer
export const addCustomer = async (req, res) => {
  const { name, phone, address } = req.body;
  try {
    const result = await db.run(
      "INSERT INTO customers (name, phone, address) VALUES (?, ?, ?)",
      [name, phone, address]
    );
    res.json({ id: result.lastID, message: "Customer added successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

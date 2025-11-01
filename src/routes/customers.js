// src/routes/customers.js
import express from "express";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const router = express.Router();

// Open SQLite connection
const dbPromise = open({
  filename: "./db/wifi.db",
  driver: sqlite3.Database,
});

// ➕ Add a new customer
router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: "Name and phone are required." });
    }

    const db = await dbPromise;
    await db.run(
      "INSERT INTO customers (name, phone, email, address) VALUES (?, ?, ?, ?)",
      [name, phone, email || "", address || ""]
    );

    res.json({ message: "Customer added successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add customer" });
  }
});

// 📜 Get all customers
router.get("/", async (req, res) => {
  try {
    const db = await dbPromise;
    const customers = await db.all("SELECT * FROM customers ORDER BY id DESC");
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});

// 👀 Get one customer
router.get("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    const customer = await db.get("SELECT * FROM customers WHERE id = ?", [
      req.params.id,
    ]);
    if (!customer) return res.status(404).json({ error: "Customer not found" });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customer" });
  }
});

// ✏️ Update customer
router.put("/:id", async (req, res) => {
  try {
    const { name, phone, email, address } = req.body;
    const db = await dbPromise;
    await db.run(
      "UPDATE customers SET name=?, phone=?, email=?, address=? WHERE id=?",
      [name, phone, email, address, req.params.id]
    );
    res.json({ message: "Customer updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update customer" });
  }
});

// ❌ Delete customer
router.delete("/:id", async (req, res) => {
  try {
    const db = await dbPromise;
    await db.run("DELETE FROM customers WHERE id = ?", [req.params.id]);
    res.json({ message: "Customer deleted successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete customer" });
  }
});

export default router;

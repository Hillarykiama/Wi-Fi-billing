import sqlite3 from "sqlite3";
import { open } from "sqlite";
import fs from "fs";

async function initDB() {
  const db = await open({
    filename: "./db/wifi.db",
    driver: sqlite3.Database,
  });

  // 🧍 Customers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT,
      address TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log("✅ Customers table created successfully!");

  // 💵 Bills table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER,
      amount REAL,
      plan TEXT,
      billing_date TEXT DEFAULT (datetime('now')),
      due_date TEXT,
      status TEXT DEFAULT 'unpaid',
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    );
  `);
  console.log("✅ Bills table created successfully!");

  console.log("✅ Database schema created successfully!");
  await db.close();
}

initDB();


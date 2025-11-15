import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPromise = open({
  filename: path.join(__dirname, "wifi.db"),
  driver: sqlite3.Database,
});

async function initDb() {
  const db = await dbPromise;

  // ✅ Create customers table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS customers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      phone TEXT,
      plan TEXT
    )
  `);

  // ✅ Create bills table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS bills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      customer_id INTEGER NOT NULL,
      amount REAL NOT NULL,
      plan TEXT,
      billing_date TEXT DEFAULT CURRENT_TIMESTAMP,
      due_date TEXT,
      status TEXT DEFAULT 'unpaid',
      FOREIGN KEY (customer_id) REFERENCES customers(id)
    )
  `);

  // ✅ Optional: Create logs table (for M-Pesa + Mikrotik events)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT,
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database initialized and tables verified.");
  return db;
}

initDb().catch(err => console.error("❌ DB Init Error:", err));

export { dbPromise };
















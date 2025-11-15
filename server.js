import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// ✅ Corrected paths
import customersRouter from "./src/routes/customers.js";
import billsRouter from "./routes/bills.js";
import mpesaRouter from "./src/routes/mpesa.js";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/customers", customersRouter);
app.use("/api/bills", billsRouter);
app.use("/api/mpesa", mpesaRouter);

// Database
const dbPromise = open({
  filename: "./db/wifi.db",
  driver: sqlite3.Database,
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("🚀 WiFi Billing API running...");
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default dbPromise;





import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

const dbPromise = open({
  filename: path.resolve("db", "wifi.db"), // ✅ Correct path from root
  driver: sqlite3.Database,
});

export default dbPromise;



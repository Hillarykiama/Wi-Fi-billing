import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

// open database connection
const db = await open({
  filename: path.join("db.sqlite"), // change path if needed
  driver: sqlite3.Database,
});

// Default export (used everywhere)
export default db;

// Optional named export (if you want getDb())
export function getDb() {
  return db;
}



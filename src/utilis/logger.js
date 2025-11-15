import { getDb } from "../models/db.js";

export async function logAction(type, reference, message) {
  const db = await getDb();
  await db.run(
    `INSERT INTO logs (type, reference, message) VALUES (?, ?, ?)`,
    [type, reference, message]
  );
  console.log(`🪵 Log: [${type}] ${message}`);
}

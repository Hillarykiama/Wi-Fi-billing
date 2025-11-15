import { getDb } from "../models/db.js";

(async () => {
  const db = await getDb();
  const plans = [
    { name: "Basic", speed: "5 Mbps", price: 1500 },
    { name: "Standard", speed: "10 Mbps", price: 2500 },
    { name: "Premium", speed: "20 Mbps", price: 4000 },
  ];

  for (const p of plans) {
    const existing = await db.get(`SELECT * FROM plans WHERE name = ?`, [p.name]);
    if (!existing) {
      await db.run(`INSERT INTO plans (name, speed, price) VALUES (?, ?, ?)`, [p.name, p.speed, p.price]);
      console.log(`✅ Added plan: ${p.name}`);
    }
  }

  console.log("✅ Plans seeded successfully");
  process.exit(0);
})();

// src/services/mikrotikMock.js
import db from "../../db/db.js";

// ✅ Activate Internet mock (called from bills.js)
export async function activateInternet({ deviceId, actionId }) {
  console.log(`🔌 Activating internet for device ${deviceId}, action ${actionId}`);

  // Insert a new mock record for tracking
  await db.run(
    `INSERT INTO mikrotik_actions (device_id, action_id, status, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [deviceId, actionId, "PENDING"]
  );

  // Simulate network activation success after 2 seconds
  setTimeout(async () => {
    await db.run(
      `UPDATE mikrotik_actions SET status = ? WHERE device_id = ? AND action_id = ?`,
      ["COMPLETED", deviceId, actionId]
    );
    console.log(`✅ Internet activated successfully for device ${deviceId}`);
  }, 2000);

  return {
    message: "Internet activation initiated",
    deviceId,
    actionId,
    status: "PENDING",
  };
}

// ✅ (Optional) Deactivate Internet mock
export async function deactivateInternet({ deviceId, actionId }) {
  console.log(`📴 Deactivating internet for device ${deviceId}, action ${actionId}`);

  await db.run(
    `INSERT INTO mikrotik_actions (device_id, action_id, status, created_at)
     VALUES (?, ?, ?, datetime('now'))`,
    [deviceId, actionId, "PENDING"]
  );

  setTimeout(async () => {
    await db.run(
      `UPDATE mikrotik_actions SET status = ? WHERE device_id = ? AND action_id = ?`,
      ["DISABLED", deviceId, actionId]
    );
    console.log(`❌ Internet deactivated for device ${deviceId}`);
  }, 2000);

  return {
    message: "Internet deactivation initiated",
    deviceId,
    actionId,
    status: "PENDING",
  };
}











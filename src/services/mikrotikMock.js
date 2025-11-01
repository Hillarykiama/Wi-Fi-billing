// src/services/mikrotikMock.js
import dbPromise from "../models/db.js";

/**
 * Simulates connecting to a Mikrotik router
 * and activating a customer's internet access.
 */
export async function activateCustomerInternet(customerId) {
  const db = await dbPromise;

  const customer = await db.get("SELECT * FROM customers WHERE id = ?", [customerId]);
  if (!customer) throw new Error("Customer not found");

  console.log(`🌐 Simulating Mikrotik activation for ${customer.name}...`);

  // Fake router delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Log simulated activation
  console.log(`✅ Internet activated for ${customer.name}`);

  return {
    message: `Internet activated for ${customer.name}`,
    customerId,
    status: "active",
  };
}



// src/services/mpesaMock.js
import db from "../models/db.js";

export async function simulateMpesaPayment(bill) {
  if (!bill || !bill.id) {
    console.warn("⚠️ simulateMpesaPayment called without valid bill");
    return { message: "Bill missing or invalid", status: "failed" };
  }

  // If already paid, just return success
  if (bill.status === "paid") {
    return {
      message: `Bill ${bill.id} is already marked as paid for ${bill.customer_name}`,
      billId: bill.id,
      amount: bill.amount,
      status: "paid",
    };
  }

  // Otherwise mark it as paid
  await db.run("UPDATE bills SET status = ? WHERE id = ?", ["paid", bill.id]);

  return {
    message: `M-Pesa payment simulated for ${bill.customer_name}`,
    billId: bill.id,
    amount: bill.amount,
    status: "paid",
  };
}


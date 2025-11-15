// src/services/mpesamock.js

import fetch from "node-fetch"; // Ensure installed: npm install node-fetch
import db from "../../db/db.js"; // Correct DB import

/**
 * Simulate M-Pesa STK Push
 * This function:
 * 1. Returns an immediate STK push response
 * 2. Sends a mock callback after 3 seconds
 */
export async function simulateSTKPush({ phone, amount, transactionId }) {
  console.log(`💰 Simulating STK Push for transaction ${transactionId}...`);

  // Automatically send mock callback after delay
  setTimeout(async () => {
    try {
      const callbackPayload = {
        transactionId,
        resultCode: 0, // 0 = SUCCESS
        resultDesc: "Mock payment successful",
      };

      const callbackUrl = "http://localhost:4000/api/mpesa/callback"; 
      // Your server runs on port 4000 — NOT 5000

      await fetch(callbackUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(callbackPayload),
      });

      console.log(`✅ Mock callback sent for transaction ${transactionId}`);
    } catch (err) {
      console.error("❌ Error sending mock callback:", err);
    }
  }, 3000);

  // Immediate response returned to API
  return {
    message: "Mock STK push initiated",
    phone,
    amount,
    transactionId,
  };
}










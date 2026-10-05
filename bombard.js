// bombard.js - Fires multiple requests at the exact same time
const productId = process.argv[2]; // Accepts product ID from terminal command

if (!productId) {
  console.error("Please provide a product ID: node bombard.js <PRODUCT_ID>");
  process.exit(1);
}

async function sendOrder(userId) {
  try {
    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, userId: `user-${userId}` })
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (err) {
    return { status: 500, error: err.message };
  }
}

async function runConcurrenyTest() {
  console.log(" Firing 50 orders concurrently...");

  // Create an array of 50 simultaneous HTTP requests
  const requests = [];
  for (let i = 1; i <= 50; i++) {
    requests.push(sendOrder(i));
  }

  // Promise.all fires all 50 requests in parallel!
  const results = await Promise.all(requests);

  const successful = results.filter((r) => r.status === 201).length;
  const failed = results.filter((r) => r.status === 400).length;

  console.log("--- RESULTS ---");
  console.log(`Total Requests Sent: 50`);
  console.log(` Successful Orders: ${successful}`);
  console.log(` Sold Out (Rejected): ${failed}`);
}

runConcurrenyTest();
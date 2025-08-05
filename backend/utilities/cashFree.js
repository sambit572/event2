import axios from "axios";

let cachedToken = null;
let tokenExpiry = null;

const BASE_URL =
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION"
    ? "https://api.cashfree.com"
    : "https://sandbox.cashfree.com";

/**
 * Generate or reuse Cashfree token
 */
export async function getCashfreeToken() {
  const now = Date.now();

  // ✅ Reuse token if still valid
  if (cachedToken && tokenExpiry && now < tokenExpiry) {
    console.log("✅ [Cashfree] Using cached token");
    return cachedToken;
  }

  console.log(
    `🔄 [Cashfree] Fetching new auth token from: ${BASE_URL}/verification/auth/token`
  );
  try {
    const resp = await axios.post(
      `${BASE_URL}/verification/auth/token`,
      {}, // Cashfree expects empty body
      {
        headers: {
          "x-client-id": process.env.CASHFREE_CLIENT_ID,
          "x-client-secret": process.env.CASHFREE_CLIENT_SECRET,
          "Content-Type": "application/json",
        },
      }
    );

    if (!resp.data?.data?.token) {
      throw new Error(
        `Token missing in response: ${JSON.stringify(resp.data)}`
      );
    }

    cachedToken = resp.data.data.token;
    tokenExpiry = now + 25 * 60 * 1000; // Renew 5 min before expiry (30 min tokens)

    console.log("✅ [Cashfree] Token generated successfully");
    return cachedToken;
  } catch (err) {
    console.error(
      "❌ [Cashfree] Token generation failed:",
      err.response?.data || err.message
    );

    // ✅ Auto-fallback to Sandbox if Production URL fails (useful in dev)
    if (
      process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" &&
      err.response?.status === 404
    ) {
      console.warn(
        "⚠️ [Cashfree] Production URL failed (404). Retrying in Sandbox..."
      );
      process.env.CASHFREE_ENVIRONMENT = "SANDBOX";
      return getCashfreeToken();
    }

    throw new Error("Failed to fetch Cashfree token");
  }
}

/**
 * Verify PAN using Cashfree
 */
export async function verifyPAN(panNumber,name) {
  console.log(`🔍 [Cashfree] Verifying PAN: ${panNumber}`);

  try {
    const token = await getCashfreeToken();

    console.log(`🌐 [Cashfree] Hitting: ${BASE_URL}/verification/pan`);

    const resp = await axios.post(
      `${BASE_URL}/verification/pan`,
      { pan: panNumber, consent: "Y" },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("📩 [Cashfree] PAN verification raw response:", resp.data);

    // ✅ Handle response status
    if (resp.data.status !== "SUCCESS") {
      console.warn(
        `⚠️ [Cashfree] PAN verification failed: ${
          resp.data.message || "Unknown error"
        }`
      );
      throw new Error(resp.data.message || "PAN verification failed");
    }

    console.log(
      "✅ [Cashfree] PAN verified successfully:",
      resp.data.data?.full_name
    );
    return resp.data;
  } catch (err) {
    console.error(
      "❌ [Cashfree] PAN verification error:",
      err.response?.data || err.message
    );
    throw new Error("PAN verification failed. Please try again later.");
  }
}

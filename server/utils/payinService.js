// utils/payinService.js
import axios from "axios";
import https from "https";

// Keep token in memory
let authToken = null;
let tokenExpiresAt = null;

// Axios instance
const payinApi = axios.create({
  baseURL: "https://api.accountpe.com/api/payin",
  headers: { "Content-Type": "application/json" },
});

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

// Fetch AccountPe token
const getAccountPeToken = async () => {
  try {
    const { data } = await payinApi.post(
      "/admin/auth",
      {
        email: process.env.ACCOUNTPE_EMAIL,
        password: process.env.ACCOUNTPE_PASSWORD,
      },
      { httpsAgent }
    );

    authToken = data.token;
    tokenExpiresAt = new Date(Date.now() + 23 * 60 * 60 * 1000);

    console.log("🔵 AccountPe Token refreshed!");
  } catch (err) {
    console.error("❌ AccountPe Auth Error:", err.response?.data || err);
    throw new Error("Unable to authenticate with AccountPe");
  }
};

// Create payment link
export const createPaymentLink = async (paymentData) => {
  return payinApi.post("/create_payment_links", paymentData, { httpsAgent });
};

// Check payment status
export const getPaymentLinkStatus = async (transaction_id) => {
  return payinApi.post(
    "/payment_link_status",
    { transaction_id },
    { httpsAgent }
  );
};

// Auto inject token
payinApi.interceptors.request.use(
  async (config) => {
    if (config.url === "/admin/auth") return config;

    if (!authToken || new Date() > tokenExpiresAt) {
      await getAccountPeToken();
    }

    config.headers.Authorization = `Bearer ${authToken}`;
    return config;
  },
  (err) => Promise.reject(err)
);

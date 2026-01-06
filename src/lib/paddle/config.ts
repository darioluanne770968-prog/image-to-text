export const PADDLE_PLANS = {
  basic: {
    name: "Basic",
    price: 9.9,
    priceId: process.env.NEXT_PUBLIC_PADDLE_BASIC_PRICE_ID || "pri_01ke8pb3w3b99240j0k7b1999y",
    features: [
      "100 conversions per day",
      "High-precision OCR",
      "20MB file size limit",
      "Batch processing (5 files)",
      "Email support",
    ],
  },
  pro: {
    name: "Pro",
    price: 19.9,
    priceId: process.env.NEXT_PUBLIC_PADDLE_PRO_PRICE_ID || "pri_01ke8pd5j0z1v1477tw8xvcxtz",
    features: [
      "500 conversions per day",
      "High-precision OCR",
      "50MB file size limit",
      "Batch processing (20 files)",
      "API access",
      "Priority support",
    ],
  },
  enterprise: {
    name: "Enterprise",
    price: 49.9,
    priceId: process.env.NEXT_PUBLIC_PADDLE_ENTERPRISE_PRICE_ID || "pri_01ke8pdzc3dskrz3mfcfxqdbp7",
    features: [
      "Unlimited conversions",
      "High-precision OCR",
      "100MB file size limit",
      "Unlimited batch processing",
      "Full API access",
      "Dedicated support",
    ],
  },
} as const;

export type PaddlePlanType = keyof typeof PADDLE_PLANS;

// Paddle environment
export const PADDLE_CLIENT_TOKEN = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN || "live_c68d38160d797d6611a1f358024";
export const PADDLE_API_KEY = process.env.PADDLE_API_KEY || "";
export const PADDLE_WEBHOOK_SECRET = process.env.PADDLE_WEBHOOK_SECRET || "";

// Paddle environment: 'sandbox' or 'production'
export const PADDLE_ENVIRONMENT = process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT || "production";

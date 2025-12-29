export const PLANS = {
  basic: {
    name: "Basic",
    price: 9.9,
    priceId: process.env.STRIPE_BASIC_PRICE_ID || "price_basic",
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
    priceId: process.env.STRIPE_PRO_PRICE_ID || "price_pro",
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
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || "price_enterprise",
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

export type PlanType = keyof typeof PLANS;

export const LEMONSQUEEZY_PLANS = {
  basic: {
    name: "Basic",
    price: 9.9,
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_BASIC_VARIANT_ID || "1191936",
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
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_PRO_VARIANT_ID || "1191941",
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
    variantId: process.env.NEXT_PUBLIC_LEMONSQUEEZY_ENTERPRISE_VARIANT_ID || "1191943",
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

export type LemonSqueezyPlanType = keyof typeof LEMONSQUEEZY_PLANS;

// Store ID from LemonSqueezy
export const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID || "";

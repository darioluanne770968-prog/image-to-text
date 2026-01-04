"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown, Building2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type PlanKey = "basic" | "pro" | "enterprise";

const plans = [
  {
    name: "Free",
    key: "free" as const,
    icon: Sparkles,
    price: "$0",
    period: "forever",
    description: "Perfect for occasional use",
    features: [
      "10 conversions per day",
      "Basic OCR (Tesseract.js)",
      "5MB file size limit",
      "Single file processing",
      "Basic text output",
      "No registration required",
    ],
    limitations: [
      "No formatted output",
      "No history saved",
      "Standard support",
    ],
    cta: "Get Started",
    href: "/",
    popular: false,
    subscribable: false,
  },
  {
    name: "Basic",
    key: "basic" as PlanKey,
    icon: Zap,
    price: "$9.9",
    period: "/month",
    description: "For regular users",
    features: [
      "100 conversions per day",
      "High-precision OCR (Azure)",
      "20MB file size limit",
      "Batch processing (5 files)",
      "Formatted text output",
      "7-day history",
      "Email support",
    ],
    limitations: [],
    cta: "Subscribe Now",
    href: "/login?plan=basic",
    popular: false,
    subscribable: true,
  },
  {
    name: "Pro",
    key: "pro" as PlanKey,
    icon: Crown,
    price: "$19.9",
    period: "/month",
    description: "For power users & teams",
    features: [
      "500 conversions per day",
      "High-precision OCR (Azure)",
      "50MB file size limit",
      "Batch processing (20 files)",
      "Formatted text output",
      "30-day history",
      "API access",
      "Priority support",
    ],
    limitations: [],
    cta: "Subscribe Now",
    href: "/login?plan=pro",
    popular: true,
    subscribable: true,
  },
  {
    name: "Enterprise",
    key: "enterprise" as PlanKey,
    icon: Building2,
    price: "$49.9",
    period: "/month",
    description: "For businesses & organizations",
    features: [
      "Unlimited conversions",
      "High-precision OCR (Azure)",
      "100MB file size limit",
      "Unlimited batch processing",
      "Formatted text output",
      "Permanent history",
      "Full API access",
      "Dedicated support",
      "Custom integrations",
    ],
    limitations: [],
    cta: "Contact Sales",
    href: "/contact",
    popular: false,
    subscribable: false,
  },
];

export default function PricingPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (planKey: PlanKey) => {
    if (!user) {
      // Not logged in, redirect to login with plan parameter
      router.push(`/login?plan=${planKey}`);
      return;
    }

    // User is logged in, create checkout session
    setLoadingPlan(planKey);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await response.json();

      if (data.error) {
        toast.error(data.error);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast.error("Failed to create checkout session");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-3xl md:text-4xl font-bold">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Choose the plan that fits your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.limitations.length > 0 && (
                  <ul className="space-y-2 pt-2 border-t">
                    {plan.limitations.map((limitation) => (
                      <li
                        key={limitation}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <span className="w-4 text-center">-</span>
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {plan.subscribable ? (
                  <Button
                    className="w-full mt-4"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handleSubscribe(plan.key as PlanKey)}
                    disabled={loadingPlan === plan.key || authLoading}
                  >
                    {loadingPlan === plan.key ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>
                ) : (
                  <Link href={plan.href} className="block">
                    <Button
                      className="w-full mt-4"
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center space-y-4">
          <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto grid gap-4 text-left">
            <FaqItem
              question="Can I cancel my subscription anytime?"
              answer="Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period."
            />
            <FaqItem
              question="What payment methods do you accept?"
              answer="We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment processor."
            />
            <FaqItem
              question="Is my data secure?"
              answer="Absolutely. All processing happens in your browser for free tier. For premium features, data is encrypted and never stored on our servers."
            />
            <FaqItem
              question="Can I upgrade or downgrade my plan?"
              answer="Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any differences."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2">{question}</h3>
        <p className="text-sm text-muted-foreground">{answer}</p>
      </CardContent>
    </Card>
  );
}

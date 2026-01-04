import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Terms of Service</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: January 1, 2025
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 prose prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing or using Image to Text (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Description of Service</h2>
              <p className="text-muted-foreground">
                Image to Text provides an online OCR (Optical Character Recognition) service that allows users to extract text from images. The Service includes free and premium subscription tiers with varying features and usage limits.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. User Accounts</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>You must provide accurate information when creating an account</li>
                <li>You are responsible for maintaining the security of your account</li>
                <li>You must notify us immediately of any unauthorized access</li>
                <li>One person or entity may not maintain multiple free accounts</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Acceptable Use</h2>
              <p className="text-muted-foreground">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Upload content that infringes on intellectual property rights</li>
                <li>Attempt to reverse engineer or hack the Service</li>
                <li>Use automated systems to access the Service without permission</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Upload malicious files or content</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Intellectual Property</h2>
              <p className="text-muted-foreground">
                The Service and its original content, features, and functionality are owned by Image to Text and are protected by international copyright, trademark, and other intellectual property laws.
              </p>
              <p className="text-muted-foreground">
                You retain ownership of any content you upload. By using the Service, you grant us a limited license to process your content solely for the purpose of providing the Service.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Payment Terms</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Premium subscriptions are billed in advance on a monthly or annual basis</li>
                <li>All fees are non-refundable unless otherwise stated</li>
                <li>We reserve the right to change pricing with 30 days notice</li>
                <li>Failed payments may result in service suspension</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Service Availability</h2>
              <p className="text-muted-foreground">
                We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. We may perform maintenance or updates that temporarily affect availability. We are not liable for any downtime or service interruptions.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, IMAGE TO TEXT SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE.
              </p>
              <p className="text-muted-foreground">
                Our total liability shall not exceed the amount paid by you, if any, for the Service during the twelve (12) months prior to the claim.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground">
                THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE THE ACCURACY OF OCR RESULTS.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Termination</h2>
              <p className="text-muted-foreground">
                We may terminate or suspend your account and access to the Service immediately, without prior notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">11. Changes to Terms</h2>
              <p className="text-muted-foreground">
                We reserve the right to modify these Terms at any time. We will notify users of significant changes via email or through the Service. Continued use after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">12. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">13. Contact Information</h2>
              <p className="text-muted-foreground">
                For any questions regarding these Terms, please contact us at{" "}
                <a href="/contact" className="text-primary hover:underline">
                  our contact page
                </a>
                .
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-muted-foreground">
            Last updated: January 1, 2025
          </p>
        </div>

        <Card>
          <CardContent className="p-6 md:p-8 prose prose-invert max-w-none">
            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground">
                Welcome to Image to Text (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our service.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">2. Data We Collect</h2>
              <p className="text-muted-foreground">
                <strong>Images:</strong> All image processing occurs locally in your browser using client-side OCR technology. Your images are NOT uploaded to our servers.
              </p>
              <p className="text-muted-foreground">
                <strong>Account Information:</strong> If you create an account, we collect your email address and any profile information you provide.
              </p>
              <p className="text-muted-foreground">
                <strong>Usage Data:</strong> We may collect anonymous usage statistics to improve our service, such as feature usage and error reports.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">3. How We Use Your Data</h2>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>To provide and maintain our service</li>
                <li>To notify you about changes to our service</li>
                <li>To provide customer support</li>
                <li>To gather analysis to improve our service</li>
                <li>To detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">4. Data Security</h2>
              <p className="text-muted-foreground">
                We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
              <p className="text-muted-foreground">
                We may use third-party services for:
              </p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Payment processing (Stripe)</li>
                <li>Authentication (Supabase)</li>
                <li>Analytics (anonymous usage data only)</li>
              </ul>
              <p className="text-muted-foreground">
                These services have their own privacy policies governing the use of your information.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">6. Cookies</h2>
              <p className="text-muted-foreground">
                We use essential cookies to maintain your session and preferences. We do not use tracking cookies for advertising purposes.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">7. Your Rights</h2>
              <p className="text-muted-foreground">You have the right to:</p>
              <ul className="list-disc pl-6 text-muted-foreground space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Object to data processing</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">8. Children&apos;s Privacy</h2>
              <p className="text-muted-foreground">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the &quot;Last updated&quot; date.
              </p>
            </section>

            <section className="space-y-4 mt-6">
              <h2 className="text-xl font-semibold">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have any questions about this Privacy Policy, please contact us at{" "}
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

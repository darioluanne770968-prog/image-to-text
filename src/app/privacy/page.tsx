export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="max-w-3xl mx-auto prose dark:prose-invert">
        <h1>Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: January 2025</p>

        <h2>1. Introduction</h2>
        <p>
          Image to Text (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
          This Privacy Policy explains how we collect, use, and safeguard your information when you use our Service.
        </p>

        <h2>2. Information We Collect</h2>
        <h3>Account Information</h3>
        <p>
          When you create an account, we collect your email address and authentication information
          provided through Google OAuth.
        </p>
        <h3>Usage Data</h3>
        <p>
          We collect information about how you use the Service, including conversion counts and subscription status.
        </p>
        <h3>Images</h3>
        <p>
          Images you upload for conversion are processed temporarily and are not stored permanently on our servers.
          For free tier users, processing occurs entirely in your browser.
        </p>

        <h2>3. How We Use Your Information</h2>
        <p>We use the collected information to:</p>
        <ul>
          <li>Provide and maintain the Service</li>
          <li>Process your transactions</li>
          <li>Send you service-related communications</li>
          <li>Improve and optimize the Service</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>
          We implement appropriate security measures to protect your personal information.
          However, no method of transmission over the Internet is 100% secure, and we cannot
          guarantee absolute security.
        </p>

        <h2>5. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <ul>
          <li><strong>Supabase</strong> - For authentication and database services</li>
          <li><strong>Paddle</strong> - For payment processing</li>
          <li><strong>Vercel</strong> - For hosting</li>
        </ul>
        <p>
          These services have their own privacy policies governing their use of your information.
        </p>

        <h2>6. Cookies</h2>
        <p>
          We use cookies and similar technologies to maintain your session and preferences.
          You can control cookies through your browser settings.
        </p>

        <h2>7. Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate data</li>
          <li>Request deletion of your data</li>
          <li>Export your data</li>
          <li>Opt-out of marketing communications</li>
        </ul>

        <h2>8. Data Retention</h2>
        <p>
          We retain your account information for as long as your account is active.
          You can request deletion of your account and associated data at any time.
        </p>

        <h2>9. Children&apos;s Privacy</h2>
        <p>
          The Service is not intended for children under 13. We do not knowingly collect
          personal information from children under 13.
        </p>

        <h2>10. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any
          changes by posting the new policy on this page.
        </p>

        <h2>11. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at privacy@imagetotext.app.
        </p>
      </div>
    </div>
  );
}

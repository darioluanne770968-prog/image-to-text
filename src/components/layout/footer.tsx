import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background safe-bottom">
      <div className="container py-6 sm:py-8 md:py-12">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-3">OCR Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Image to Text
                </Link>
              </li>
              <li>
                <Link href="/batch" className="hover:text-foreground transition-colors">
                  Batch Upload
                </Link>
              </li>
              <li>
                <Link href="/image-translator" className="hover:text-foreground transition-colors">
                  Image Translator
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-word" className="hover:text-foreground transition-colors">
                  JPG to Word
                </Link>
              </li>
              <li>
                <Link href="/jpg-to-excel" className="hover:text-foreground transition-colors">
                  JPG to Excel
                </Link>
              </li>
              <li>
                <Link href="/qr-scanner" className="hover:text-foreground transition-colors">
                  QR Scanner
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">PDF Tools</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/pdf-to-text" className="hover:text-foreground transition-colors">
                  PDF to Text
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-word" className="hover:text-foreground transition-colors">
                  PDF to Word
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-excel" className="hover:text-foreground transition-colors">
                  PDF to Excel
                </Link>
              </li>
              <li>
                <Link href="/pdf-to-jpg" className="hover:text-foreground transition-colors">
                  PDF to JPG
                </Link>
              </li>
              <li>
                <Link href="/text-to-pdf" className="hover:text-foreground transition-colors">
                  Text to PDF
                </Link>
              </li>
              <li>
                <Link href="/image-to-pdf" className="hover:text-foreground transition-colors">
                  Image to PDF
                </Link>
              </li>
              <li>
                <Link href="/text-to-image" className="hover:text-foreground transition-colors">
                  Text to Image
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-foreground transition-colors">
                  API Documentation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/history" className="hover:text-foreground transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Login / Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Image to Text. All rights reserved.</p>
          <p className="mt-2">*Your privacy is protected! No data is transmitted or stored.</p>
        </div>
      </div>
    </footer>
  );
}

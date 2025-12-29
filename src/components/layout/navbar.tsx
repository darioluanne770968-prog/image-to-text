"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageIcon, Menu, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { useI18n } from "@/lib/i18n/context";

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const navItems = [
    { href: "/", label: t.nav.imageToText },
    { href: "/batch", label: t.nav.batchUpload },
    { href: "/image-translator", label: t.nav.imageTranslator },
    { href: "/jpg-to-word", label: t.nav.jpgToWord },
    { href: "/jpg-to-excel", label: t.nav.jpgToExcel },
    { href: "/pdf-to-excel", label: t.nav.pdfToExcel },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
              <ImageIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg hidden sm:inline-block">
              Image To Text
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/pricing">
            <Button variant="ghost" size="sm" className="hidden sm:flex gap-2">
              <Sparkles className="h-4 w-4" />
              {t.nav.pricing}
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t.nav.login}</span>
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navItems.map((item) => (
                <DropdownMenuItem key={item.href} asChild>
                  <Link href={item.href}>{item.label}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem asChild>
                <Link href="/pricing">{t.nav.pricing}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

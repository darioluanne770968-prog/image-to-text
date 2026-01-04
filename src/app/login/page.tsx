"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, Lock, Github, Chrome } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const planParam = searchParams.get("plan");
  const authError = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const lastErrorRef = useRef<string | null>(null);

  const plan = planParam === "basic" || planParam === "pro" ? planParam : null;
  const safeNext =
    nextParam && nextParam.startsWith("/") ? nextParam : null;
  const nextPath = safeNext ?? (plan ? `/pricing?plan=${plan}` : "/dashboard");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!authError || authError === lastErrorRef.current) return;

    lastErrorRef.current = authError;

    const message =
      errorDescription ||
      (authError === "auth_failed"
        ? "Authentication failed. Please try again."
        : "An error occurred");

    toast.error(message);
  }, [authError, errorDescription]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          nextPath
        )}`;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectTo,
          },
        });

        if (error) throw error;

        if (data.session) {
          toast.success("Welcome!");
          router.push(nextPath);
        } else {
          toast.success("Check your email for the confirmation link!");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        router.push(nextPath);
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        nextPath
      )}`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
        },
      });

      if (error) throw error;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {isSignUp
            ? "Sign up to access premium features"
            : "Sign in to your account"}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("google")}
            disabled={isLoading}
          >
            <Chrome className="h-4 w-4 mr-2" />
            Google
          </Button>
          <Button
            variant="outline"
            onClick={() => handleOAuthLogin("github")}
            disabled={isLoading}
          >
            <Github className="h-4 w-4 mr-2" />
            GitHub
          </Button>
        </div>

        <div className="relative">
          <Separator />
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
            or continue with email
          </span>
        </div>

        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                required
                minLength={6}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isSignUp ? "Creating account..." : "Signing in..."}
              </>
            ) : isSignUp ? (
              "Create Account"
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account?{" "}
              <button
                onClick={() => setIsSignUp(false)}
                className="text-primary hover:underline"
              >
                Sign in
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setIsSignUp(true)}
                className="text-primary hover:underline"
              >
                Sign up
              </button>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}

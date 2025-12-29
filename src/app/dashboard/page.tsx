"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HistoryList } from "@/components/history/history-list";
import { useHistory } from "@/hooks/use-history";
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  Zap,
  Crown,
  FileText,
  Languages,
  Table2,
  Layers,
  History,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface UserStats {
  dailyUsage: number;
  dailyLimit: number;
  plan: "free" | "basic" | "pro" | "enterprise";
  totalConversions: number;
}

const planLimits = {
  free: 10,
  basic: 100,
  pro: 500,
  enterprise: 9999,
};

const planLabels = {
  free: { label: "Free", icon: Zap },
  basic: { label: "Basic", icon: Zap },
  pro: { label: "Pro", icon: Crown },
  enterprise: { label: "Enterprise", icon: Crown },
};

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { history, isLoading: historyLoading, deleteConversion } = useHistory();

  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<UserStats>({
    dailyUsage: 0,
    dailyLimit: 10,
    plan: "free",
    totalConversions: 0,
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      setStats({
        dailyUsage: 0,
        dailyLimit: planLimits.free,
        plan: "free",
        totalConversions: 0,
      });

      setLoading(false);
    };

    getUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) return null;

  const usagePercent = (stats.dailyUsage / stats.dailyLimit) * 100;
  const PlanIcon = planLabels[stats.plan].icon;

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">
              Manage your account and usage
            </p>
          </div>
          <Button variant="ghost" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Profile</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {user.user_metadata?.full_name || "User"}
                  </p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <PlanIcon className="h-3 w-3" />
                    <Badge variant="secondary" className="text-xs">
                      {planLabels[stats.plan].label}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Daily Usage
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{stats.dailyUsage}</span>
                  <span className="text-muted-foreground">
                    / {stats.dailyLimit} conversions
                  </span>
                </div>
                <Progress value={usagePercent} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Resets daily at midnight UTC
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Conversions
              </CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <span className="text-3xl font-bold">
                  {stats.totalConversions}
                </span>
                <p className="text-xs text-muted-foreground">
                  All time conversions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <Link href="/">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <FileText className="h-6 w-6" />
                  <span>Image to Text</span>
                </Button>
              </Link>
              <Link href="/batch">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <Layers className="h-6 w-6" />
                  <span>Batch Upload</span>
                </Button>
              </Link>
              <Link href="/image-translator">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <Languages className="h-6 w-6" />
                  <span>Translate</span>
                </Button>
              </Link>
              <Link href="/jpg-to-excel">
                <Button variant="outline" className="w-full h-24 flex-col gap-2">
                  <Table2 className="h-6 w-6" />
                  <span>To Excel</span>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link href="/pricing">
                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </Button>
              </Link>
              <Button variant="outline" className="w-full justify-start" disabled>
                <Settings className="h-4 w-4 mr-2" />
                Account Settings (Coming Soon)
              </Button>
            </CardContent>
          </Card>
        </div>

        <HistoryList
          history={history}
          isLoading={historyLoading}
          onDelete={deleteConversion}
        />

        {stats.plan === "free" && (
          <Card className="border-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Upgrade to Pro</h3>
                  <p className="text-muted-foreground">
                    Get 500 conversions/day, high-precision OCR, and priority support.
                  </p>
                </div>
                <Link href="/pricing">
                  <Button>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

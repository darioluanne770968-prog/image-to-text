"use client";

import { useHistory } from "@/hooks/use-history";
import { HistoryList } from "@/components/history/history-list";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { History, LogIn } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function HistoryPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { history, isLoading, deleteConversion } = useHistory();

  if (authLoading) {
    return (
      <div className="container py-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardContent className="py-12 text-center">
              <div className="animate-pulse">Loading...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-2 mb-6">
            <div className="flex items-center justify-center gap-2">
              <History className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Conversion History
              </h1>
            </div>
            <p className="text-muted-foreground">
              View and manage your past conversions
            </p>
          </div>

          <Card>
            <CardContent className="py-12 text-center">
              <LogIn className="h-12 w-12 mx-auto text-muted-foreground/50" />
              <h3 className="text-lg font-medium mt-4">Login Required</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Please login to view your conversion history
              </p>
              <Link href="/login">
                <Button>
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <History className="h-8 w-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Conversion History
            </h1>
          </div>
          <p className="text-muted-foreground">
            View and manage your past conversions
          </p>
        </div>

        <HistoryList
          history={history}
          isLoading={isLoading}
          onDelete={deleteConversion}
        />
      </div>
    </div>
  );
}

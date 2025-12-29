"use client";

import { useState, useEffect, useCallback } from "react";
import type { Conversion, ConversionType } from "@/lib/supabase/database.types";

export function useHistory() {
  const [history, setHistory] = useState<Conversion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/history");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch history");
      }

      setHistory(data.history || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveConversion = useCallback(
    async (params: {
      type: ConversionType;
      input_filename: string;
      input_format: string;
      output_text: string;
      language: string;
    }) => {
      try {
        const response = await fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok) {
          // Silently fail for unauthorized (user not logged in)
          if (response.status === 401) return null;
          throw new Error(data.error || "Failed to save conversion");
        }

        // Add to local state
        if (data.conversion) {
          setHistory((prev) => [data.conversion, ...prev]);
        }

        return data.conversion;
      } catch (err) {
        console.error("Save conversion error:", err);
        return null;
      }
    },
    []
  );

  const deleteConversion = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/history?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete conversion");
      }

      setHistory((prev) => prev.filter((item) => item.id !== id));
      return true;
    } catch (err) {
      console.error("Delete conversion error:", err);
      return false;
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return {
    history,
    isLoading,
    error,
    fetchHistory,
    saveConversion,
    deleteConversion,
  };
}

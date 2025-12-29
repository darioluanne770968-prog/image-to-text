"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, Loader2, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface StarRatingProps {
  page: string;
  compact?: boolean;
}

export function StarRating({ page, compact = false }: StarRatingProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasRated, setHasRated] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState({ averageRating: 0, totalRatings: 0 });

  useEffect(() => {
    // Check localStorage for existing rating
    const existingRating = localStorage.getItem(`rating_${page}`);
    if (existingRating) {
      setHasRated(true);
      setRating(parseInt(existingRating, 10));
    }

    // Fetch rating stats
    fetchStats();
  }, [page]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/rating?page=${page}`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch rating stats:", error);
    }
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback, page }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      localStorage.setItem(`rating_${page}`, rating.toString());
      setHasRated(true);
      setDialogOpen(false);
      toast.success("Thank you for your feedback!");
      fetchStats();
    } catch {
      toast.error("Failed to submit rating. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (interactive = true, size = "h-6 w-6") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive || hasRated}
            onClick={() => interactive && setRating(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={cn(
              "transition-colors",
              interactive && !hasRated && "cursor-pointer hover:scale-110"
            )}
          >
            <Star
              className={cn(
                size,
                "transition-colors",
                (interactive ? (hoverRating || rating) >= star : stats.averageRating >= star)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  if (compact) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4",
                    stats.averageRating >= star
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground/50"
                  )}
                />
              ))}
            </div>
            <span>
              {stats.totalRatings > 0
                ? `${stats.averageRating} (${stats.totalRatings} reviews)`
                : "Rate this tool"}
            </span>
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {hasRated ? "Thanks for rating!" : "Rate this tool"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex justify-center">{renderStars()}</div>
            {!hasRated && (
              <>
                <Textarea
                  placeholder="Tell us what you think (optional)"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                />
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || rating === 0}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Rating"
                  )}
                </Button>
              </>
            )}
            {hasRated && (
              <div className="text-center text-muted-foreground">
                <ThumbsUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p>Your feedback helps us improve!</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        {renderStars()}
        {stats.totalRatings > 0 && (
          <span className="text-sm text-muted-foreground">
            {stats.averageRating} ({stats.totalRatings} reviews)
          </span>
        )}
      </div>
      {!hasRated && (
        <>
          <Textarea
            placeholder="Tell us what you think (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={3}
          />
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || rating === 0}
            className="w-full"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Rating"
            )}
          </Button>
        </>
      )}
      {hasRated && (
        <div className="text-center text-muted-foreground">
          <ThumbsUp className="h-6 w-6 mx-auto mb-1 text-green-500" />
          <p className="text-sm">Thank you for your feedback!</p>
        </div>
      )}
    </div>
  );
}

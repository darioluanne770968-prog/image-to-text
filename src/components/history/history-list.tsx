"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Languages,
  FileSpreadsheet,
  Trash2,
  Copy,
  Eye,
  Loader2,
  Clock,
  Layers,
} from "lucide-react";
import { toast } from "sonner";
import type { Conversion, ConversionType } from "@/lib/supabase/database.types";

const typeIcons: Record<ConversionType, React.ReactNode> = {
  image_to_text: <FileText className="h-4 w-4" />,
  image_translate: <Languages className="h-4 w-4" />,
  jpg_to_word: <FileText className="h-4 w-4" />,
  jpg_to_excel: <FileSpreadsheet className="h-4 w-4" />,
  pdf_to_excel: <FileSpreadsheet className="h-4 w-4" />,
  batch: <Layers className="h-4 w-4" />,
};

const typeLabels: Record<ConversionType, string> = {
  image_to_text: "Image to Text",
  image_translate: "Image Translation",
  jpg_to_word: "JPG to Word",
  jpg_to_excel: "JPG to Excel",
  pdf_to_excel: "PDF to Excel",
  batch: "Batch Processing",
};

interface HistoryListProps {
  history: Conversion[];
  isLoading: boolean;
  onDelete: (id: string) => Promise<boolean>;
}

export function HistoryList({ history, isLoading, onDelete }: HistoryListProps) {
  const [previewItem, setPreviewItem] = useState<Conversion | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await onDelete(id);
    if (success) {
      toast.success("Deleted successfully");
    } else {
      toast.error("Failed to delete");
    }
    setDeletingId(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
          <p className="text-muted-foreground mt-2">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  if (history.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Clock className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="text-lg font-medium mt-4">No history yet</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Your conversion history will appear here
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Conversion History
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
            >
              <div className="p-2 bg-primary/10 rounded-lg">
                {typeIcons[item.type]}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.input_filename}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{typeLabels[item.type]}</span>
                  <span>•</span>
                  <span>{formatDate(item.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewItem(item)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopy(item.output_text)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-destructive" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {previewItem && typeIcons[previewItem.type]}
              {previewItem?.input_filename}
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto">
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm whitespace-pre-wrap break-words">
                {previewItem?.output_text}
              </pre>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => previewItem && handleCopy(previewItem.output_text)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button onClick={() => setPreviewItem(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

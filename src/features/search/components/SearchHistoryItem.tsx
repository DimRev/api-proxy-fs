import React from "react";

import type { QueryHistoryEntry } from "../interfaces/search.interface";
import { cn } from "~/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/shared/components/ui/card";
import { Skeleton } from "~/shared/components/ui/skeleton";

interface SearchHistoryItemPreviewProps {
  item: QueryHistoryEntry;
  onClick: (item: QueryHistoryEntry) => void;
  className?: string;
}

export function SearchHistoryItemPreview({
  item,
  onClick,
  className,
}: SearchHistoryItemPreviewProps) {
  const formattedTimestamp = new Date(item.timestamp).toLocaleString();

  return (
    <Card
      className={cn(
        "mb-3 cursor-pointer bg-white/15 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/25 hover:shadow-md",
        className,
      )}
      onClick={() => onClick(item)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick(item);
        }
      }}
      tabIndex={0}
      role="button"
    >
      <CardHeader className="pt-4 pb-2">
        <CardTitle className="text-lg text-purple-300">{item.query}</CardTitle>
        <CardDescription className="text-purple-200">
          Searched on: {formattedTimestamp}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-purple-100">
          {item.data?.length ?? 0} result(s) found
        </p>
      </CardContent>
    </Card>
  );
}

export function SearchHistoryItemSkeleton() {
  return (
    <Card className="mb-3 bg-white/15 backdrop-blur-md">
      <CardHeader className="pt-4 pb-2">
        <Skeleton className="h-6 w-3/4 rounded-md" /> {/* For Title */}
        <Skeleton className="mt-1 h-4 w-1/2 rounded-md" /> {/* For Timestamp */}
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <Skeleton className="h-4 w-1/4 rounded-md" /> {/* For Result Count */}
      </CardContent>
    </Card>
  );
}

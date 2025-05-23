"use client";

import { useEffect, useRef, useState } from "react";
import { useGetSearchHistoryQuery } from "../hooks/use-get-search-history-query";
import type { QueryHistoryEntry } from "../interfaces/search.interface";
import {
  SearchHistoryItemPreview,
  SearchHistoryItemSkeleton,
} from "./SearchHistoryItem";
import { Button } from "~/shared/components/ui/button";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { Input } from "~/shared/components/ui/input";

type Props = {
  className?: string;
};

function SearchHistoryList({ className }: Props) {
  const [page, setPage] = useState(1);
  const [dispPage, setDispPage] = useState("1");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState(10);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const scrollableContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: searchHistoryData,
    isLoading: isSearchHistoryLoading,
    isError: isSearchHistoryError,
    error: searchHistoryError,
    isFetching: isSearchHistoryFetching,
  } = useGetSearchHistoryQuery({ page, pageSize });

  useEffect(() => {
    setIsClient(true);
  }, []);

  function handleItemClick(item: QueryHistoryEntry) {
    router.push(`/search?q=${encodeURIComponent(item.query)}`);
  }

  function handleNextPage() {
    if (searchHistoryData && page < searchHistoryData.totalPages) {
      setPage(page + 1);
      setDispPage(`${page + 1}`);
      scrollToTop();
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1);
      setDispPage(`${page - 1}`);
      scrollToTop();
    }
  }

  function scrollToTop() {
    if (scrollableContainerRef.current) {
      scrollableContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function renderSkeletons() {
    return Array.from({ length: pageSize }).map((_, index) => (
      <SearchHistoryItemSkeleton key={`skeleton-${index}`} />
    ));
  }

  function handlePageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (isNaN(Number(e.target.value))) {
      return;
    }
    setDispPage(e.target.value);
  }

  function handlePageNav() {
    if (
      searchHistoryData &&
      !isNaN(Number(dispPage)) &&
      +dispPage > 0 &&
      +dispPage <= searchHistoryData.totalPages &&
      +dispPage !== page
    ) {
      setPage(+dispPage);
      scrollToTop();
      return;
    }
    setDispPage(page.toString());
  }

  return (
    <div
      className={cn(
        "flex h-full flex-col border-l border-gray-600 bg-gray-800/50 p-4 shadow-lg md:w-[300px] lg:w-[350px]",
        className,
      )}
    >
      <h2 className="mb-4 shrink-0 text-center text-xl font-semibold text-white">
        Search History
      </h2>

      <div ref={scrollableContainerRef} className="grow overflow-y-auto pr-1">
        {isSearchHistoryLoading && (
          <div className="space-y-3">{renderSkeletons()}</div>
        )}
        {!isSearchHistoryLoading && isSearchHistoryError && (
          <div
            className="border-destructive bg-destructive/10 text-destructive rounded-md border p-4 text-center"
            role="alert"
          >
            <p className="font-medium">Error loading search history:</p>
            <pre className="mt-1 text-sm">
              {searchHistoryError?.message || "An unknown error occurred."}
            </pre>
          </div>
        )}
        {!isSearchHistoryLoading &&
          !isSearchHistoryError &&
          (!searchHistoryData?.entries ||
            searchHistoryData.entries.length === 0) && (
            <div className="text-muted-foreground flex h-full flex-col items-center justify-center rounded-md border border-dashed p-6 text-center">
              <p>No search history found.</p>
              <p className="text-sm">Try making some searches first!</p>
            </div>
          )}
        {!isSearchHistoryLoading &&
          !isSearchHistoryError &&
          searchHistoryData?.entries &&
          searchHistoryData.entries.length > 0 && (
            <div className="space-y-0">
              {searchHistoryData.entries.map((item) => (
                <SearchHistoryItemPreview
                  key={`${item.query}-${item.timestamp}`}
                  item={item}
                  onClick={handleItemClick}
                />
              ))}
            </div>
          )}
      </div>

      <div className="mt-auto shrink-0 border-t border-gray-600 pt-4">
        <div className="flex items-center justify-between">
          {isSearchHistoryLoading ? (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-500 bg-gray-700 opacity-50"
              >
                Previous
              </Button>
              <span className="text-muted-foreground animate-pulse px-2 text-xs">
                Loading pages...
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-500 bg-gray-700 opacity-50"
              >
                Next
              </Button>
            </>
          ) : searchHistoryData && searchHistoryData.totalPages > 0 ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
                disabled={page <= 1 || isSearchHistoryFetching}
                className="cursor-pointer border-gray-500 bg-gray-700 hover:bg-gray-600"
              >
                Previous
              </Button>
              <span className="text-muted-foreground flex items-center gap-1 px-2 text-xs">
                <span>Page</span>
                {isClient ? (
                  <div className="relative w-12">
                    <Input
                      value={dispPage}
                      onChange={handlePageInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handlePageNav();
                        }
                      }}
                      onBlur={handlePageNav}
                      className="h-7 w-full rounded border-gray-500 bg-gray-700 px-2 py-1 text-center text-xs font-bold text-purple-300 focus:border-purple-500 focus:ring-0"
                    />
                  </div>
                ) : (
                  <span>{dispPage}</span>
                )}
                <span>of {searchHistoryData.totalPages}</span>
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNextPage}
                disabled={
                  page >= searchHistoryData.totalPages ||
                  isSearchHistoryFetching
                }
                className="cursor-pointer border-gray-500 bg-gray-700 hover:bg-gray-600"
              >
                Next
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-500 bg-gray-700 opacity-50"
              >
                Previous
              </Button>
              <span className="text-muted-foreground px-2 text-xs">
                Page 0 of 0
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="border-gray-500 bg-gray-700 opacity-50"
              >
                Next
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchHistoryList;

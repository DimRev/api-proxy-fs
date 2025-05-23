"use client";

import { useState } from "react";
import { useGetSearchHistoryQuery } from "../hooks/use-get-search-history-query";
import type { QueryHistoryEntry } from "../interfaces/search.interface";
import {
  SearchHistoryItemPreview,
  SearchHistoryItemSkeleton,
} from "./SearchHistoryItem";
import { Button } from "~/shared/components/ui/button";

function SearchHistoryList() {
  const [page, setPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pageSize, _setPageSize] = useState(10);

  const {
    data: searchHistoryData,
    isLoading: isSearchHistoryLoading,
    isError: isSearchHistoryError,
    error: searchHistoryError,
    isFetching: isSearchHistoryFetching,
  } = useGetSearchHistoryQuery({ page, pageSize });

  console.log("SearchHistoryList data:", searchHistoryData);

  function handleItemClick(item: QueryHistoryEntry) {
    console.log("Clicked history item:", item);
  }

  function handleNextPage() {
    if (searchHistoryData && page < searchHistoryData.totalPages) {
      setPage(page + 1);
    }
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  function renderSkeletons() {
    return Array.from({ length: pageSize }).map((_, index) => (
      <SearchHistoryItemSkeleton key={`skeleton-${index}`} />
    ));
  }

  return (
    <div className="flex h-full flex-col border-l border-gray-600 bg-gray-800/50 p-4 shadow-lg md:w-[300px] lg:w-[350px]">
      <h2 className="mb-4 shrink-0 text-center text-xl font-semibold text-white">
        Search History
      </h2>

      <div className="grow overflow-y-auto pr-1">
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
            // Pagination placeholder during loading
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
              <span className="text-muted-foreground px-2 text-xs">
                Page {searchHistoryData.currentPage} of{" "}
                {searchHistoryData.totalPages}
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

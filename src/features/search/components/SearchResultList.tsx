"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { cn } from "~/lib/utils";
import { useGetSearchQuery } from "../hooks/use-get-search-query";
import { Input } from "~/shared/components/ui/input";
import SearchResultItem from "./SearchResultItem";
import Loader from "~/shared/components/Loader";

type Props = {
  className?: string;
  currentQuery: string;
};

function SearchResultList({ className, currentQuery }: Props) {
  const searchParams = useSearchParams();
  const displayQuery = useMemo(
    () => searchParams.get("q") ?? "",
    [searchParams],
  );

  const [highlightTerm, setHighlightTerm] = useState("");

  const {
    data: searchResultsData,
    isPending: isPendingSearchResults,
    isError: isErrorSearchResults,
    error: errorSearchResults,
  } = useGetSearchQuery({ query: displayQuery });

  const actualSearchResults = searchResultsData;
  const currentQueryTrimmed = currentQuery.trim();

  if (currentQueryTrimmed.length === 0) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        <h2>Please enter a search term.</h2>
      </div>
    );
  }

  if (isPendingSearchResults) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        <Loader
          loadingText={`Loading search results for "${displayQuery}"...`}
        />
      </div>
    );
  }

  if (isErrorSearchResults) {
    return (
      <div className={cn("pt-10 text-center text-red-400", className)}>
        <h2>
          Error loading results for {`"${displayQuery}"`}:{" "}
          {errorSearchResults?.message || "Unknown error"}
        </h2>
      </div>
    );
  }

  if (!isPendingSearchResults) {
    if (!actualSearchResults || actualSearchResults.length === 0) {
      return (
        <div className={cn("pt-10 text-center text-gray-400", className)}>
          <h2>No results found for {`"${displayQuery}"`}.</h2>
        </div>
      );
    }

    return (
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <h2 className="w-full grow text-xl font-semibold text-white">
            Search Results for:{" "}
            <span className="text-pink-400">{displayQuery}</span>
          </h2>
          <div className="flex w-fit items-center gap-4 text-xl">
            <h2>Highlight: </h2>
            <Input
              className="min-w-[200px]"
              placeholder="Enter a term"
              value={highlightTerm}
              onChange={(e) => setHighlightTerm(e.target.value)}
            />
          </div>
        </div>
        <ul className="space-y-3">
          {actualSearchResults.map((result, idx) => {
            return (
              <SearchResultItem
                result={result}
                highlightTerm={highlightTerm}
                key={result.url + idx}
              />
            );
          })}
        </ul>
      </div>
    );
  }

  if (
    currentQueryTrimmed.length > 0 &&
    !isPendingSearchResults &&
    !isErrorSearchResults &&
    !actualSearchResults
  ) {
    return (
      <div className={cn("", className)}>
        <Loader loadingText={`Preparing to search for "${displayQuery}"...`} />
      </div>
    );
  }

  return (
    <div className={cn("", className)}>
      {displayQuery ? (
        <Loader
          loadingText={`Search results for "${displayQuery}" will appear here.`}
        />
      ) : (
        "Enter a query to see results."
      )}
    </div>
  );
}

export default SearchResultList;

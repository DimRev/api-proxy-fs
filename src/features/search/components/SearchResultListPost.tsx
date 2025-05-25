"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn, debounce } from "~/lib/utils";
import { usePostSearchMutate } from "../hooks/use-post-search-mutate";
import SearchResultItem from "./SearchResultItem";
import { Input } from "~/shared/components/ui/input";
import Loader from "~/shared/components/Loader";

type Props = {
  className?: string;
  currentQuery: string;
};

function SearchResultListPost({ className, currentQuery }: Props) {
  const searchParams = useSearchParams();
  const displayQuery = useMemo(
    () => searchParams.get("q") ?? "",
    [searchParams],
  );

  const {
    data: searchResultsData,
    isPending: isPendingSearchResults,
    isError: isErrorSearchResults,
    error: errorSearchResults,
    mutateAsync: getSearchResults,
    reset: resetMutationState,
  } = usePostSearchMutate();

  const initiatedQueryRef = useRef<string | null>(null);
  const debounceTimeout = 300;
  const [highlightTerm, setHighlightTerm] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (queryToFetch: string) => {
      try {
        await getSearchResults(
          { query: queryToFetch },
          {
            onError: (error) => {
              console.error(
                `SearchResults: Error for "${queryToFetch}":`,
                error,
              );
            },
          },
        );
      } catch (error) {
        console.error(`SearchResults: Error from getSearchResults:`, error);
        if (initiatedQueryRef.current === queryToFetch) {
          initiatedQueryRef.current = null;
        }
      }
    }, debounceTimeout),
    [getSearchResults, debounceTimeout],
  );

  useEffect(() => {
    const queryToProcess = currentQuery.trim();

    if (queryToProcess.length === 0) {
      console.log(
        "SearchResults EFFECT: Query is empty. Clearing initiatedRef.",
      );
      initiatedQueryRef.current = null;
      resetMutationState();
      debouncedFetch.cancel();
      return;
    }

    if (queryToProcess !== initiatedQueryRef.current) {
      initiatedQueryRef.current = queryToProcess;
      debouncedFetch(queryToProcess).catch((err) => {
        console.error(
          "Error from top-level debouncedFetch call in useEffect:",
          err,
        );
      });
    }
  }, [currentQuery, debouncedFetch, resetMutationState]);

  const actualSearchResults = searchResultsData;
  const currentQueryTrimmed = currentQuery.trim();

  if (currentQueryTrimmed.length === 0) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        Please enter a search term.
      </div>
    );
  }

  if (
    isPendingSearchResults &&
    initiatedQueryRef.current === currentQueryTrimmed
  ) {
    return (
      <div className={cn("", className)}>
        <Loader
          loadingText={`Loading search results for "${displayQuery}"...`}
        />
      </div>
    );
  }

  if (
    isErrorSearchResults &&
    initiatedQueryRef.current === currentQueryTrimmed
  ) {
    return (
      <div className={cn("pt-10 text-center text-red-400", className)}>
        Error loading results for {`"${displayQuery}"`}:{" "}
        {errorSearchResults?.message || "Unknown error"}
      </div>
    );
  }

  if (
    !isPendingSearchResults &&
    initiatedQueryRef.current === currentQueryTrimmed
  ) {
    if (!actualSearchResults || actualSearchResults.length === 0) {
      return (
        <div className={cn("pt-10 text-center text-gray-400", className)}>
          No results found for {`"${displayQuery}"`}.
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
    initiatedQueryRef.current === currentQueryTrimmed &&
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

export default SearchResultListPost;

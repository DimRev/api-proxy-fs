"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { cn, debounce } from "~/lib/utils";
import { useGetSearchMutate } from "../hooks/use-get-search-mutate";

type Props = {
  className?: string;
  currentQuery: string;
};

function SearchResults({ className, currentQuery }: Props) {
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
  } = useGetSearchMutate();

  const initiatedQueryRef = useRef<string | null>(null);
  const debounceTimeout = 300;

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
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        Loading search results for {`"${displayQuery}"`}...
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
        <h2 className="text-xl font-semibold text-white">
          Search Results for:{" "}
          <span className="text-pink-400">{displayQuery}</span>
        </h2>
        <ul className="space-y-3">
          {actualSearchResults.map((result, idx) => (
            <li
              key={result.url || idx} // Ensure a stable key
              className="rounded-md border border-gray-700 bg-gray-800/60 p-3"
            >
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-300 hover:text-purple-200 hover:underline"
              >
                {result.title}
              </a>
            </li>
          ))}
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
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        Preparing to search for {`"${displayQuery}"`}...
      </div>
    );
  }

  return (
    <div className={cn("pt-10 text-center text-gray-400", className)}>
      {displayQuery
        ? `Search results for "${displayQuery}" will appear here.`
        : "Enter a query to see results."}
    </div>
  );
}

export default SearchResults;

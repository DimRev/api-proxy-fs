"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { cn } from "~/lib/utils";
import { useGetSearchMutate } from "../hooks/use-get-search-mutate";

type Props = {
  className?: string;
  currentQuery: string;
};

function SearchResults({ className, currentQuery }: Props) {
  const searchParams = useSearchParams();
  const displayQuery = searchParams.get("q") ?? "";

  const {
    data: searchResultsData,
    isPending: isPendingSearchResults,
    isError: isErrorSearchResults,
    error: errorSearchResults,
    mutateAsync: getSearchResults,
  } = useGetSearchMutate();

  const initiatedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    const queryToFetch = currentQuery.trim();
    if (queryToFetch.length === 0) {
      initiatedQueryRef.current = null;
      return;
    }

    if (queryToFetch !== initiatedQueryRef.current) {
      if (!isPendingSearchResults) {
        console.log(
          `SearchResults: Initiating search for: "${queryToFetch}". Previous: "${initiatedQueryRef.current}"`,
        );
        initiatedQueryRef.current = queryToFetch;

        getSearchResults(
          { query: queryToFetch },
          {
            onSuccess: (data) => {
              console.log(
                `SearchResults: Success for "${queryToFetch}":`,
                data,
              );
            },
            onError: (error) => {
              console.error(
                `SearchResults: Error for "${queryToFetch}":`,
                error,
              );
              if (initiatedQueryRef.current === queryToFetch) {
                initiatedQueryRef.current = null;
              }
            },
          },
        ).catch((err) => {
          console.error(
            "SearchResults: Uncaught error from getSearchResults promise:",
            err,
          );
          if (initiatedQueryRef.current === queryToFetch) {
            initiatedQueryRef.current = null;
          }
        });
      } else {
        console.log(
          `SearchResults: Search pending. Skipping for: "${queryToFetch}"`,
        );
      }
    } else {
      console.log(
        `SearchResults: Query "${queryToFetch}" matches initiated. No new fetch.`,
      );
    }
  }, [currentQuery, getSearchResults, isPendingSearchResults]);

  if (currentQuery.trim().length === 0) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        Please enter a search term.
      </div>
    );
  }

  if (isPendingSearchResults && !searchResultsData) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        Loading search results for {displayQuery}...
      </div>
    );
  }

  if (isErrorSearchResults) {
    return (
      <div className={cn("pt-10 text-center text-red-400", className)}>
        Error loading results for {displayQuery}:{" "}
        {errorSearchResults?.message || "Unknown error"}
      </div>
    );
  }

  if (!searchResultsData || searchResultsData.length === 0) {
    return (
      <div className={cn("pt-10 text-center text-gray-400", className)}>
        No results found for {displayQuery}.
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
        {searchResultsData.map((result, idx) => (
          <li
            key={result.url || idx}
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

export default SearchResults;

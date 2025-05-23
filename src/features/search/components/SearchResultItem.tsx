"use client";
import React, { useMemo } from "react";
import type { SearchResult } from "../interfaces/search.interface";

type Props = {
  result: SearchResult;
  highlightTerm: string;
};

function SearchResultItem({ result, highlightTerm }: Props) {
  const parts = useMemo(() => {
    if (!highlightTerm) {
      return [{ text: result.title, highlighted: false }];
    }

    const regex = new RegExp(`(${highlightTerm})`, "gi");
    const splitTitle = result.title.split(regex);

    return splitTitle.map((text) => {
      if (text.toLowerCase() === highlightTerm.toLowerCase() && text) {
        return { text: text, highlighted: true };
      } else {
        return { text: text, highlighted: false };
      }
    });
  }, [highlightTerm, result.title]);

  return (
    <li className="rounded-md border border-gray-700 bg-gray-800/60 p-3">
      <a
        href={result.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-purple-300 hover:text-purple-200 hover:underline"
      >
        {parts.map((part, index) =>
          part.highlighted ? (
            <span key={index} className="bg-yellow-400 text-purple-600">
              {part.text}
            </span>
          ) : (
            part.text
          ),
        )}
      </a>
    </li>
  );
}

export default SearchResultItem;

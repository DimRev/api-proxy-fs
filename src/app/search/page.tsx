"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchInput from "~/features/search/components/SearchInput";
import SearchResults from "~/features/search/components/SearchResults";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initialQuery = useMemo(() => {
    return searchParams.get("q") ?? "";
  }, [searchParams]);

  useEffect(() => {
    if (isClient && initialQuery.trim().length === 0) {
      router.push("/");
    }
  }, [initialQuery, router, isClient]);

  return (
    <div className="flex h-full w-full flex-col">
      <SearchInput className="shrink px-12 py-4" initialValue={initialQuery} />
      <SearchResults
        className="w-full grow overflow-y-auto px-4"
        currentQuery={initialQuery}
      />
    </div>
  );
}

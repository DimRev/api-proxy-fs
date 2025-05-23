"use client";

import { Home } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import SearchInput from "~/features/search/components/SearchInput";
// import SearchResultList from "~/features/search/components/SearchResultList";
import SearchResultListPost from "~/features/search/components/SearchResultListPost";
import { buttonVariants } from "~/shared/components/ui/button";

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
    <div className="relative flex h-full w-full flex-col">
      <SearchInput className="shrink px-12 py-4" initialValue={initialQuery} />
      {/* <SearchResultList
        className="w-full grow overflow-y-auto px-4"
        currentQuery={initialQuery}
      /> */}
      <SearchResultListPost
        className="w-full grow overflow-y-auto px-4"
        currentQuery={initialQuery}
      />

      <div className="absolute end-0 bottom-0 p-4">
        <Link
          href="/"
          className={buttonVariants({
            size: "icon",
            variant: "outline",
            className:
              "bg-white/10 text-purple-300 hover:bg-white/20 hover:text-purple-200",
          })}
        >
          <Home />
        </Link>
      </div>
    </div>
  );
}

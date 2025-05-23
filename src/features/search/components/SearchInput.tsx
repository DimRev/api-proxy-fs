"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react"; // Added FormEvent
import { cn } from "~/lib/utils";
import { Button } from "~/shared/components/ui/button";
import { Input } from "~/shared/components/ui/input";
import { Skeleton } from "~/shared/components/ui/skeleton";

type Props = {
  className?: string;
  initialValue?: string;
};

function SearchInput({ className, initialValue = "" }: Props) {
  const router = useRouter();
  const [value, setValue] = useState(initialValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const queryToSubmit = value.trim();
    console.log("SearchInput: Submitting search query:", queryToSubmit);

    if (queryToSubmit.length > 0) {
      router.push(`/search?q=${encodeURIComponent(queryToSubmit)}`);
    } else {
      console.info("SearchInput: Search query is empty, not navigating.");
    }
  }

  const renderContent = isClient;

  return (
    <form
      className={cn("flex items-center gap-2", className)}
      onSubmit={handleSubmit}
    >
      {renderContent ? (
        <>
          <Input
            placeholder="Search..."
            className="h-16 flex-grow rounded-full rounded-e-none px-8"
            value={value}
            onChange={handleChange}
            aria-label="Search query"
          />
          <Button
            variant="outline"
            className="h-16 cursor-pointer rounded-full rounded-s-none bg-white/10 px-8"
            type="submit"
            disabled={!value.trim()}
          >
            Search
          </Button>
        </>
      ) : (
        <>
          <Skeleton className="h-16 flex-grow rounded-full rounded-e-none bg-white/5 px-8" />
          <Button
            variant="outline"
            className="h-16 cursor-pointer rounded-full rounded-s-none bg-white/10 px-8"
            disabled
            type="button"
          >
            Search
          </Button>
        </>
      )}
    </form>
  );
}

export default SearchInput;

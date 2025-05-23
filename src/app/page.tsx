import SearchInput from "~/features/search/components/SearchInput";

export default async function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <SearchInput className="w-full px-[27%]" />
    </div>
  );
}

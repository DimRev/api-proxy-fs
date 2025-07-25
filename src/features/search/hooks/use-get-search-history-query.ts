import { api } from "~/trpc/react";
import type { GetSearchHistoryQuerySchema } from "../interfaces/search.schema";

export function useGetSearchHistoryQuery(input: GetSearchHistoryQuerySchema) {
  return api.search.getHistory.useQuery(input, {
    refetchInterval: 1000 * 60,
    staleTime: 1000 * 60,
  });
}

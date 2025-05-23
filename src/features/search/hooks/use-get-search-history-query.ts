import { api } from "~/trpc/react";
import type { GetSearchHistoryQuerySchema } from "../interfaces/search.schema";

export function useGetSearchQuery(input: GetSearchHistoryQuerySchema) {
  return api.search.getHistory.useQuery(input);
}

import { api } from "~/trpc/react";
import type { GetSearchQuerySchema } from "../interfaces/search.schema";
import { useEffect } from "react";

export function useGetSearchQuery(input: GetSearchQuerySchema) {
  const context = api.useUtils();

  const resp = api.search.get.useQuery(input);

  useEffect(() => {
    if (resp.isSuccess) {
      void context.search.getHistory.invalidate();
    }
  }, [context.search.getHistory, resp.isSuccess]);

  return resp;
}

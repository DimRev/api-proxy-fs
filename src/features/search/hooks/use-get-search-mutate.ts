import { api } from "~/trpc/react";

export function useGetSearchMutate() {
  const context = api.useUtils();
  return api.search.get.useMutation({
    onSuccess: () => {
      void context.search.getHistory.invalidate();
    },
  });
}

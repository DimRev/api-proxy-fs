import { api } from "~/trpc/react";

export function usePostSearchQuery() {
  const context = api.useUtils();
  return api.search.post.useMutation({
    onSuccess: () => {
      void context.search.getHistory.invalidate();
    },
  });
}

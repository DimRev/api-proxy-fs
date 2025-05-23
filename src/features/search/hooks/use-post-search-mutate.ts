import { api } from "~/trpc/react";

export function usePostSearchMutate() {
  const context = api.useUtils();
  return api.search.post.useMutation({
    onSuccess: () => {
      void context.search.getHistory.invalidate();
    },
  });
}

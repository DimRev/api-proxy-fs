import type {
  PaginatedQueryHistory,
  SearchResult,
} from "~/features/search/interfaces/search.interface";
import {
  getSearchHistoryQuerySchema,
  getSearchQuerySchema,
} from "~/features/search/interfaces/search.schema";
import { AXIOS_ROUTER } from "~/lib/axios";
import { trpcCatchAndParseError } from "~/lib/trpc";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const searchRouter = createTRPCRouter({
  get: publicProcedure
    .input(getSearchQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        const res = await ctx.axios.get<SearchResult[]>(
          AXIOS_ROUTER.V1.SEARCH.DEFAULT,
          {
            params: {
              q: input.query,
            },
          },
        );
        return res.data;
      } catch (err) {
        trpcCatchAndParseError(err);
      }
    }),
  post: publicProcedure
    .input(getSearchQuerySchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const res = await ctx.axios.post<SearchResult[]>(
          AXIOS_ROUTER.V1.SEARCH.DEFAULT,
          input,
        );

        return res.data;
      } catch (err) {
        trpcCatchAndParseError(err);
      }
    }),

  getHistory: publicProcedure
    .input(getSearchHistoryQuerySchema)
    .query(async ({ input, ctx }) => {
      try {
        let page = 1;
        let pageSize = 10;

        if (input.page) page = input.page;
        if (input.pageSize) pageSize = input.pageSize;

        const res = await ctx.axios.get<PaginatedQueryHistory>(
          AXIOS_ROUTER.V1.SEARCH.HISTORY,
          {
            params: {
              page,
              pageSize,
            },
          },
        );

        return res.data;
      } catch (err) {
        trpcCatchAndParseError(err);
      }
    }),
});

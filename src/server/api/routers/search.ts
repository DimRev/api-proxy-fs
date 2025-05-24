import type {
  GetHistoryRequestParams,
  GetSearchRequestParams,
  PaginatedQueryHistoryResponse,
  PostSearchRequestBody,
  SearchResultResponse,
} from "@repo/interfaces";
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
        const params: GetSearchRequestParams = {
          q: input.query,
        };

        const res = await ctx.axios.get<SearchResultResponse[]>(
          AXIOS_ROUTER.V1.SEARCH.DEFAULT,
          {
            params,
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
      const body: PostSearchRequestBody = {
        query: input.query,
      };

      try {
        const res = await ctx.axios.post<SearchResultResponse[]>(
          AXIOS_ROUTER.V1.SEARCH.DEFAULT,
          body,
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

        const params: GetHistoryRequestParams = {
          page,
          pageSize,
        };

        const res = await ctx.axios.get<PaginatedQueryHistoryResponse>(
          AXIOS_ROUTER.V1.SEARCH.HISTORY,
          {
            params,
          },
        );

        return res.data;
      } catch (err) {
        trpcCatchAndParseError(err);
      }
    }),
});

import { z } from "zod";

export const getSearchQuerySchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export type GetSearchQuerySchema = z.infer<typeof getSearchQuerySchema>;

export const postSearchMutateSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export type PostSearchMutateSchema = z.infer<typeof postSearchMutateSchema>;

export const getSearchHistoryQuerySchema = z.object({
  page: z.number().min(1, "Page is required").optional(),
  pageSize: z.number().min(5, "Page size is required").optional(),
});

export type GetSearchHistoryQuerySchema = z.infer<
  typeof getSearchHistoryQuerySchema
>;

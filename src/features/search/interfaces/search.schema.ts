import { z } from "zod";

export const getSearchMutateSchema = z.object({
  query: z.string().min(1, "Query is required"),
});

export type GetSearchMutateSchema = z.infer<typeof getSearchMutateSchema>;

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

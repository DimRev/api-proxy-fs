export type SearchResult = {
  title: string;
  url: string;
};

export type QueryHistoryEntry = {
  query: string;
  timestamp: string;
  data: SearchResult[];
};

export type PaginatedQueryHistory = {
  entries: QueryHistoryEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

export type SearchResult = {
  title: string;
  url: string;
};

export type QueryHistoryEntry = {
  query: string;
  timestamp: string;
  data: SearchResult[];
};

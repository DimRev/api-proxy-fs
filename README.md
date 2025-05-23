# Api Proxy - Full Stack

This is a search application built using the T3 stack (Next.js, tRPC,
Tailwind CSS, Prisma). It provides a search interface with search history.

## Features

- **Search Input:** Allows users to enter search queries.
- **Search Results:** Displays search results fetched from an external API
  (configured via `BASE_API_URL` environment variable).
- **Search History:** Maintains a history of previous search queries with
  pagination.
- **Debounced Search:** Uses a debounced function to prevent excessive API
  calls.
- **tRPC API:** Implements a tRPC API for efficient and type-safe data
  fetching.
- **React Query:** Utilizes React Query for data caching and state
  management.
- **Tailwind CSS:** Styled with Tailwind CSS for a modern and responsive UI.
- **Shadcn UI:** Utilizes Shadcn UI components for a consistent design.

## Technologies Used

- [Next.js](https://nextjs.org/): React framework for building performant web
  applications.
- [tRPC](https://trpc.io/): End-to-end typesafe APIs.
- [React Query](https://tanstack.com/query/latest): Data fetching and caching
  library for React.
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework for
  rapid UI development.
- [Zod](https://github.com/colinhacks/zod): TypeScript-first schema
  validation with static type inference.
- [Axios](https://github.com/axios/axios): Promise based HTTP client for the
  browser and node.js.
- [Shadcn UI](https://ui.shadcn.com/): Beautiful and modern UI
  components.

## Prerequisites

- Node.js (>= 18)
- pnpm

## Installation

1.  Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  Install dependencies:

    ```bash
    pnpm install
    ```

3.  Create an `.env` file in the root directory. The `BASE_API_URL` variable
    needs to be configured.

    ```env
    BASE_API_URL=http://localhost:3000/api #example
    ```

    Adjust the value to your backend API.

## Running the Application

```bash
pnpm dev
```

This will start the development server. Open
[http://localhost:3000](http://localhost:3000) with your browser to see the
result.

## API Endpoints (tRPC)

The application uses tRPC endpoints which are defined in
`src/server/api/routers/search.ts`.

- `search.get`: Fetches search results based on a query.
- `search.post`: Fetches search results using a POST request based on a
  query.
- `search.getHistory`: Retrieves search history with pagination.

## Key Components

- `src/app/page.tsx`: Home page with the main search input.
- `src/app/search/page.tsx`: Search results page.
- `src/features/search/components/SearchInput.tsx`: Search input component.
- `src/features/search/components/SearchResultList.tsx`: Displays search
  results using a GET request.
- `src/features/search/components/SearchResultListPost.tsx`: Displays search
  results using a POST request and debouncing.
- `src/features/search/components/SearchHistoryList.tsx`: Displays the
  search history.

## Error Handling

The application utilizes tRPC's error handling capabilities, including error
formatting and Axios error handling. Errors are displayed in the UI to provide
feedback to the user.

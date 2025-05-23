import { TRPCError } from "@trpc/server";
import { AxiosError } from "axios";

export function trpcCatchAndParseError(err: unknown) {
  if (err instanceof AxiosError) {
    const axiosError = err as AxiosError<{ message: string }>;

    const statusCode = axiosError.response?.status ?? 500;
    const message = axiosError.response?.data?.message ?? err.message;

    if (statusCode === 400) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message,
        cause: err,
      });
    } else if (statusCode === 404) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message,
        cause: err,
      });
    } else {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: message || "An unexpected error occurred",
        cause: err,
      });
    }
  }

  throw new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred",
    cause: err,
  });
}

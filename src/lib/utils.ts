/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function debounce<F extends (...args: any[]) => any>(
  func: F,
  waitFor: number,
): ((...args: Parameters<F>) => Promise<ReturnType<F>>) & {
  cancel: () => void;
  flush: () => Promise<ReturnType<F>> | undefined;
} {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<F> | null = null;
  let lastThis: any = null;
  let promiseResolve: ((value: ReturnType<F>) => void) | null = null;
  let promiseReject: ((reason?: any) => void) | null = null;
  let currentPromise: Promise<ReturnType<F>> | null = null;

  const invokeFunc = () => {
    if (lastArgs && promiseResolve && promiseReject) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const result = func.apply(lastThis, lastArgs);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (result && typeof result.then === "function") {
          (result as Promise<ReturnType<F>>)
            .then(promiseResolve)
            .catch(promiseReject);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          promiseResolve(result);
        }
      } catch (error) {
        promiseReject(error);
      }
    }
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
    promiseResolve = null;
    promiseReject = null;
    currentPromise = null;
  };

  const debounced = function (
    this: any,
    ...args: Parameters<F>
  ): Promise<ReturnType<F>> {
    lastArgs = args;
    // eslint-disable-next-line @typescript-eslint/no-this-alias, @typescript-eslint/no-unsafe-assignment
    lastThis = this;

    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    currentPromise = new Promise<ReturnType<F>>((resolve, reject) => {
      promiseResolve = resolve;
      promiseReject = reject;
    });

    timeoutId = setTimeout(invokeFunc, waitFor);

    return currentPromise;
  };

  debounced.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    if (promiseReject) {
      promiseReject(new Error("Debounced function call was cancelled."));
    }
    timeoutId = null;
    lastArgs = null;
    lastThis = null;
    promiseResolve = null;
    promiseReject = null;
    currentPromise = null;
  };

  debounced.flush = (): Promise<ReturnType<F>> | undefined => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      const promiseToReturn = currentPromise;
      invokeFunc();
      return promiseToReturn ?? undefined;
    }
    return undefined;
  };

  return debounced;
}

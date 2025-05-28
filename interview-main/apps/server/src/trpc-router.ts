import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { Elysia } from "elysia";
import { appRouter } from "./api/root";
import { createTRPCContext } from "./api/trpc";

export const trpcRouter = new Elysia().all("/trpc/*", async (opts) => {
  const res = await fetchRequestHandler({
    endpoint: "/trpc/api",
    router: appRouter,
    req: opts.request,
    createContext: async () => {
      const ctx = await createTRPCContext({ headers: opts.request.headers });
      return ctx;
    },
    onError: ({ path, error }) => {
      console.error(
        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
      );
      console.error(error);
    },
  });

  // Set CORS headers
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Headers", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Credentials", "false");

  return res;
});

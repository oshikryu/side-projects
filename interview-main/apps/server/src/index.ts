import { Elysia } from "elysia";
import { trpcRouter } from "./trpc-router";

const app = new Elysia({ prefix: "/api" })
  .options("*", ({ set }) => {
    set.headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Max-Age": "86400",
    };
    return new Response(null, { status: 200 }); // Respond with HTTP 204
  })
  .use(trpcRouter)
  .listen(process.env.PORT ?? 3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);

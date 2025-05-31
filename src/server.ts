import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { leakyBucketMiddleware } from "./core/middleware/leaky-bucket";
import { authMiddleware } from "./core/middleware/auth";

const app = new Koa();

app.use(bodyParser());
app.use(authMiddleware);
app.use(leakyBucketMiddleware);

app.use(async (ctx) => {
  if (ctx.method === "POST" && ctx.path === "/query-pix-key") {
    const { pixKey } = ctx.request.body as { pixKey: string };

    return (ctx.body = {
      message: "Pix key found",
      pixKey,
      owner: ctx.state.user.name,
    });
  }

  return (ctx.status = 404);
});

app.use(async (ctx) => {
  ctx.body = "OK";
});

app.listen(3333, "0.0.0.0", () => {
  console.log("Server running...");
});

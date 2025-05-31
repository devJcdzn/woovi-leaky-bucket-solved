import { Middleware } from "koa";
import { users } from "../../lib/const";

export const authMiddleware: Middleware = async (ctx, next) => {
  const authHeader = ctx.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    ctx.status = 401;
    ctx.body = { message: "Unauthorized" };
    return;
  }

  const token = authHeader.replace("Bearer ", "");
  const user = users.find((u) => u.token === token);

  if (!user) {
    ctx.status = 401;
    ctx.body = { message: "Invalid token" };
    return;
  }

  ctx.state.user = user;
  await next();
};

import Router from "koa-router";
import { users } from "../../lib/const";

const router = new Router();

router.post("/query-pix-key", (ctx) => {
  const { pixKey } = ctx.request.body as { pixKey: string };

  if (!pixKey || pixKey.length < 5) {
    ctx.status = 400;

    return (ctx.body = { message: "Invalid Pix Key" });
  }

  const owner = users.find((user) => user.pixKey === pixKey);

  if (!owner) {
    ctx.status = 404;
    return (ctx.body = {
      message: "Pix key not found.",
    });
  }

  return (ctx.body = {
    message: "Pix key found",
    pixKey,
    owner: owner.name,
  });
});

export default router;

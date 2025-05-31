import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { leakyBucketMiddleware } from "./core/middleware/leaky-bucket";
import { authMiddleware } from "./core/middleware/auth";
import { users } from "./lib/const";
import router from "./app/routes/pix-key.routes";

const app = new Koa();

app.use(bodyParser());
app.use(authMiddleware);
app.use(leakyBucketMiddleware);

app.use(router.routes()).use(router.allowedMethods());

export { app };

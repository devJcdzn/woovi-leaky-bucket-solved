import { Middleware } from "koa";

type Bucket = {
  tokens: number;
  lastRefill: number;
};

interface LeakyBucketConfig {
  capacity: number;
  leakRate: number;
  keyGen?: (ctx: any) => string;
}

const MAX_TOKENS = 10;
const REFILL_INTERVAL = 60 * 60 * 1000;

const buckets = new Map<string, Bucket>();

export const leakyBucketMiddleware: Middleware = async (ctx, next) => {
  const user = ctx.state.user;
  const now = Date.now();

  let bucket = buckets.get(user.id);

  if (!bucket) {
    bucket = {
      tokens: MAX_TOKENS,
      lastRefill: now,
    };

    buckets.set(user.id, bucket);
  }

  const hoursPassed = Math.floor((now - bucket.lastRefill) / REFILL_INTERVAL);

  if (hoursPassed > 0) {
    bucket.tokens = Math.min(MAX_TOKENS, bucket.tokens + hoursPassed);
    bucket.lastRefill = now;
  }

  if (bucket.tokens <= 0) {
    ctx.status = 429;
    ctx.body = {
      message: "TOO MANY REQUESTS",
    };
  }

  ctx.state._consumeToken = () => {
    bucket.tokens = Math.max(0, bucket.tokens - 1);
  };

  await next();

  if (ctx.status >= 400) ctx.state._consumeToken();
  console.log({ bucket });
};

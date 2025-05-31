import { Middleware } from "koa";

type Bucket = {
  lastCheck: number;
  tokens: number;
};

interface LeakyBucketConfig {
  capacity: number;
  leakRate: number;
  keyGen?: (ctx: any) => string;
}

const CAPACITY = 10;
const LEAK_RATE = 1;

const buckets = new Map<string, Bucket>();

export const leakyBucketMiddleware: Middleware = async (ctx, next) => {
  const user = ctx.state.user;
  const now = Date.now();

  const bucket = buckets.get(user.id) || {
    lastCheck: now,
    tokens: 0,
  };

  const deltaTime = (now - bucket.lastCheck) / 1000;
  const leakedTokens = deltaTime * LEAK_RATE;

  bucket.tokens = Math.max(0, bucket.tokens - leakedTokens);
  bucket.lastCheck = now;

  if (bucket.tokens < CAPACITY) {
    bucket.tokens += 1;
    buckets.set(user.id, bucket);
    return await next();
  }

  ctx.status = 429;
  ctx.body = { message: "TOO MANY REQUESTS" };
};

const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");
require("dotenv").config();

const ratelimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "60 s"),
});

module.exports = ratelimiter;

const ratelimiter = require("../config/upstash")

const rateLimiter = async (req, res, next) => {
  try {
    const { success } = await ratelimiter.limit(req.ip);

    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }

    next();
  } catch (error) {
    console.log("Rate limiter error: ", error);
    next(error);
  }
};

module.exports = rateLimiter

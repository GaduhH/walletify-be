const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const rateLimiterMiddleware = async (req, res, next) => {
  try {
    // Pastikan req.ip tersedia
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || '127.0.0.1';
    
    const { success } = await ratelimiter.limit(clientIP);
    
    if (!success) {
      return res.status(429).json({
        message: "Too many requests, please try again later.",
      });
    }
    
    next();
  } catch (error) {
    console.log("Rate limiter error: ", error);
    // Jika ada error dengan rate limiter, biarkan request tetap lanjut
    // Atau bisa juga return error jika ingin strict
    next(); // Lanjutkan tanpa rate limiting jika ada error
    // next(error); // Uncomment ini jika ingin strict error handling
  }
};

// Wrap dengan asyncHandler
const rateLimiter = asyncHandler(rateLimiterMiddleware);

export default rateLimiter;

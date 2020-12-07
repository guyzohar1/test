const rateLimit = require("express-rate-limit");

//set rate limiter
const IMAGE_RATE_PER_MINUTE = process.env.IMAGE_RATE_PER_MINUTE || 100;
exports.imageRateLimiter =  rateLimit({
  windowMs:  60 * 1000, // 60 MS = 60 seconds 
  max: IMAGE_RATE_PER_MINUTE, 
  message:
    "Too many Image downloads"
});

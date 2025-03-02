const redisClient = require("../config/redis");

const cacheMiddleware = async (req, res, next) => {
  const key = req.originalUrl;
  const cachedData = await redisClient.get(key);

  if (cachedData) {
    return res.status(200).json(JSON.parse(cachedData));
  }

  res.sendResponse = res.json;
  res.json = (body) => {
    redisClient.setEx(key, 3600, JSON.stringify(body)); // Cache for 1 hour
    res.sendResponse(body);
  };

  next();
};

module.exports = cacheMiddleware;

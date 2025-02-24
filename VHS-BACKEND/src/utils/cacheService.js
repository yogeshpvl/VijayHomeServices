const redis = require("redis");

const client = redis.createClient();

client.on("connect", () => {
  console.log("✅ Redis Connected Successfully!");
});

client.on("ready", () => {
  console.log("🚀 Redis is Ready to Use!");
});

client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

client.on("end", () => {
  console.warn("⚠️ Redis Connection Closed!");
});

const DEFAULT_EXPIRATION = 300; // 5 minutes

const cacheService = {
  get: (key) => {
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) return reject(err);
        if (data) return resolve(JSON.parse(data));
        return resolve(null);
      });
    });
  },

  set: (key, value, ttl = DEFAULT_EXPIRATION) => {
    client.setex(key, ttl, JSON.stringify(value));
  },

  del: (key) => {
    client.del(key);
  },

  checkConnection: () => {
    return client.connected
      ? "✅ Redis is Connected"
      : "❌ Redis is NOT Connected";
  },
};

module.exports = { cacheService, client };

const redis = require("redis");

const client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
});

// ✅ Connect to Redis
client.connect().catch(console.error);

client.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

client.on("connect", () => {
  console.log("✅ Connected to Redis");
});

const setCache = async (key, data, expiry = 3600) => {
  try {
    const jsonData = JSON.stringify(data);
    await client.setEx(key, expiry, jsonData);
  } catch (err) {
    console.error("❌ Redis Set Error:", err);
  }
};

// ✅ Get cache
const getCache = async (key) => {
  try {
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("❌ Redis Get Error:", err);
    return null;
  }
};

// ✅ Delete cache
const deleteCache = async (key) => {
  try {
    await client.del(key);
    console.log(`✅ Deleted Cache: ${key}`);
  } catch (err) {
    console.error("❌ Redis Delete Error:", err);
  }
};

module.exports = { setCache, getCache, deleteCache };

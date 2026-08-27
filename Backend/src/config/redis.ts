import { createClient } from "redis";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

export const redisClient = createClient({
  url: redisUrl,
  pingInterval: 10000, // Keep-alive ping for cloud Redis (Upstash)
  socket: {
    reconnectStrategy: (retries: number) => {
      // Reconnect with backoff up to 3 seconds max interval
      return Math.min(retries * 500, 3000);
    },
  },
});

let hasLoggedError = false;

redisClient.on("error", (err) => {
  if (!hasLoggedError) {
    console.log("Redis unavailable:", err.message || err);
    console.log("Application will continue running normally using MongoDB.");
    hasLoggedError = true;
  }
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis Connected & Ready!");
  hasLoggedError = false;
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch {
    // Graceful catch when Redis server is offline
  }
};

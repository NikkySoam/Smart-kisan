import { redisClient } from "../config/redis";

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    if (!redisClient.isOpen) return null;
    const data = await redisClient.get(key);
    if (data) {
      console.log(`Redis cache HIT: ${key}`);
      return JSON.parse(data) as T;
    }
    console.log(`Redis cache MISS: ${key}`);
    return null;
  } catch (error) {
    console.log(`Redis getCache error for key ${key}:`, error);
    return null;
  }
};

export const setCache = async (
  key: string,
  value: unknown,
  ttlSeconds: number
): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) return false;
    const serialized = JSON.stringify(value);
    await redisClient.setEx(key, ttlSeconds, serialized);
    console.log(`Redis cache SET: ${key} (TTL: ${ttlSeconds}s)`);
    return true;
  } catch (error) {
    console.log(`Redis setCache error for key ${key}:`, error);
    return false;
  }
};

export const deleteCache = async (key: string): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) return false;
    await redisClient.del(key);
    console.log(`Redis cache INVALIDATED: ${key}`);
    return true;
  } catch (error) {
    console.log(`Redis deleteCache error for key ${key}:`, error);
    return false;
  }
};

export const deleteCachePattern = async (pattern: string): Promise<boolean> => {
  try {
    if (!redisClient.isOpen) return false;
    const keys: string[] = [];
    for await (const key of redisClient.scanIterator({ MATCH: pattern })) {
      keys.push(String(key));
    }
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`Redis cache INVALIDATED PATTERN: ${pattern} (${keys.length} keys deleted)`);
    }
    return true;
  } catch (error) {
    console.log(`Redis deleteCachePattern error for pattern ${pattern}:`, error);
    return false;
  }
};

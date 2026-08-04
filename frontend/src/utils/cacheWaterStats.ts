import { dbPromise } from "./offlineDB";

export const cacheWaterStats =
  async (stats: Record<string, unknown>) => {

    const db =
      await dbPromise;

    await db.put(
      "waterStats",
      stats,
      "dashboard"
    );
};
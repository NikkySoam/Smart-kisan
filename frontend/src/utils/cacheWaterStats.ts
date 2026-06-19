import { dbPromise } from "./offlineDB";

export const cacheWaterStats =
  async (stats: any) => {

    const db =
      await dbPromise;

    await db.put(
      "waterStats",
      stats,
      "dashboard"
    );
};
import { dbPromise } from "./offlineDB";

export const getCachedWaterStats =
  async () => {

    const db =
      await dbPromise;

    return await db.get(
      "waterStats",
      "dashboard"
    );
};
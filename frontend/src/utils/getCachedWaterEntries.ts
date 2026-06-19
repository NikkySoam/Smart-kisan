import { dbPromise } from "./offlineDB";

export const getCachedWaterEntries =
  async () => {

    const db =
      await dbPromise;

    return await db.getAll(
      "waterEntries"
    );
};
import { dbPromise } from "./offlineDB";

export const getPendingWaterCount =
  async () => {

    const db =
      await dbPromise;

    const entries =
      await db.getAll(
        "pendingWaterEntries"
      );

    return entries.length;
  };
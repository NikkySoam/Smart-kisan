import { dbPromise } from "./offlineDB";

export const getCachedFarmers =
  async () => {

    const db =
      await dbPromise;

    return await db.getAll(
      "farmers"
    );
  };
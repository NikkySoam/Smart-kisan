import { dbPromise } from "./offlineDB";

export const getCachedSettings =
  async () => {

    const db =
      await dbPromise;

    return await db.get(
      "settings",
      "user-settings"
    );
};
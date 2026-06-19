import { dbPromise } from "./offlineDB";

export const cacheSettings =
  async (settings: any) => {

    const db =
      await dbPromise;

    await db.put(
      "settings",
      settings,
      "user-settings"
    );
};
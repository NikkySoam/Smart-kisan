import { dbPromise } from "./offlineDB";

export const cacheSettings =
  async (settings: Record<string, unknown>) => {

    const db =
      await dbPromise;

    await db.put(
      "settings",
      settings,
      "user-settings"
    );
};
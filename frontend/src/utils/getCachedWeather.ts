import { dbPromise } from "./offlineDB";

export const getCachedWeather =
  async () => {

    const db =
      await dbPromise;

    return await db.get(
      "weather",
      "current-weather"
    );
};
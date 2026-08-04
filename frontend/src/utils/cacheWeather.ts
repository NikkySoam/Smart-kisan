import { dbPromise } from "./offlineDB";

export const cacheWeather =
  async (
    weather: Record<string, unknown>
  ) => {

    const db =
      await dbPromise;

    await db.put(
      "weather",
      weather,
      "current-weather"
    );
};
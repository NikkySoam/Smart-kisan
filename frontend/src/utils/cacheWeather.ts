import { dbPromise } from "./offlineDB";

export const cacheWeather =
  async (
    weather: any
  ) => {

    const db =
      await dbPromise;

    await db.put(
      "weather",
      weather,
      "current-weather"
    );
};
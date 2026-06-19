import API from "../api/axios";
import { dbPromise } from "./offlineDB";

export const syncWaterEntries =
  async () => {

    const token =
      localStorage.getItem(
        "token"
      );

    const db =
      await dbPromise;

    const entries =
      await db.getAll(
        "pendingWaterEntries"
      );

    for (const entry of entries) {

      try {

        await API.post(
          "/water",
          {
            farmer:
              entry.farmer,
            hours:
              entry.hours,
            date:
              entry.date,
          },
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        await db.delete(
          "pendingWaterEntries",
          entry.id
        );

      } catch (error) {

        console.log(
          "Sync failed"
        );

      }
    }
  };
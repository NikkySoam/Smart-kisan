import { dbPromise } from "./offlineDB";

export const saveOfflineWater =
  async (data: any) => {
    const db =
      await dbPromise;

    await db.add(
      "pendingWaterEntries",
      {
        ...data,
        createdOfflineAt:
          new Date(),
      }
    );

    window.dispatchEvent(
    new Event(
        "offline-entry-added"
    )
    );
  };
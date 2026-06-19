import { dbPromise } from "./offlineDB";

export const cacheWaterEntries =
  async (
    entries: any[]
  ) => {

    const db =
      await dbPromise;

    const tx =
      db.transaction(
        "waterEntries",
        "readwrite"
      );

    await tx.store.clear();

    for (
      const entry of entries
    ) {

      await tx.store.put(
        entry
      );

    }

    await tx.done;
};
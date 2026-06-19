import { dbPromise } from "./offlineDB";

export const cacheFarmers =
  async (
    farmers: any[]
  ) => {

    const db =
      await dbPromise;

    const tx =
      db.transaction(
        "farmers",
        "readwrite"
      );

    await tx.store.clear();

    for (
      const farmer of farmers
    ) {
      await tx.store.put(
        farmer
      );
    }

    await tx.done;
  };
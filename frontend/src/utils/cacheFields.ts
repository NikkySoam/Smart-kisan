import { dbPromise } from "./offlineDB";

export interface CachedFieldsData {
  fields: unknown[];
  analytics: Record<string, unknown>;
}

export const cacheFields = async (
  fieldsData: CachedFieldsData
) => {
  const db = await dbPromise;

  await db.put("fields", fieldsData, "apnaKhet");
};

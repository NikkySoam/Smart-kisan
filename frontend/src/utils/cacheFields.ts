import { dbPromise } from "./offlineDB";

export interface CachedFieldsData {
  fields: any[];
  analytics: Record<string, any>;
}

export const cacheFields = async (
  fieldsData: CachedFieldsData
) => {
  const db = await dbPromise;

  await db.put("fields", fieldsData, "apnaKhet");
};

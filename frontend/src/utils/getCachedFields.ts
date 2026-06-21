import { dbPromise } from "./offlineDB";

export interface CachedFieldsData {
  fields: any[];
  analytics: Record<string, any>;
}

export const getCachedFields = async (): Promise<CachedFieldsData | null> => {
  const db = await dbPromise;

  return await db.get("fields", "apnaKhet");
};

import { dbPromise } from "./offlineDB";

export interface CachedFieldsData {
  fields: unknown[];
  analytics: Record<string, unknown>;
}

export const getCachedFields = async (): Promise<CachedFieldsData | null> => {
  const db = await dbPromise;

  return await db.get("fields", "apnaKhet");
};

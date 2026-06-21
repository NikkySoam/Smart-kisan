import { openDB } from "idb";

export const dbPromise = openDB(
  "smart-kisan-db",
  5,
  {
    upgrade(db) {
      if (
        !db.objectStoreNames.contains(
          "pendingWaterEntries"
        )
      ) {
        db.createObjectStore(
          "pendingWaterEntries",
          {
            keyPath: "id",
            autoIncrement: true,
          }
        );
      }


        if (
        !db.objectStoreNames.contains(
        "farmers"
        )
    ) {
        db.createObjectStore(
        "farmers",
        {
            keyPath: "_id",
        }
        );
    }

    if (
        !db.objectStoreNames.contains(
            "waterStats"
        )
        ) {
        db.createObjectStore(
            "waterStats"
        );
        }


    if (
        !db.objectStoreNames.contains(
            "settings"
        )
        ) {
        db.createObjectStore(
            "settings"
        );
        }

    if (
        !db.objectStoreNames.contains(
            "weather"
        )
        ) {
        db.createObjectStore(
            "weather"
        );
        }

    if (
        !db.objectStoreNames.contains(
            "waterEntries"
        )
        ) {
        db.createObjectStore(
            "waterEntries",
            {
            keyPath: "_id",
            }
        );
        }

    if (
        !db.objectStoreNames.contains(
            "fields"
        )
        ) {
        db.createObjectStore(
            "fields"
        );
        }

    },
  }
);
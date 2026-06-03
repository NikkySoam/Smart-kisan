import { Response } from "express";

import Field from "../models/Field";

import FieldWater from "../models/FieldWater";

import Fertilizer from "../models/Fertilizer";

import Notification from "../models/Notification";

import { AuthRequest } from "../middleware/authMiddleware";


// CHECK REMINDERS

export const checkReminders =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      // DELETE NOTIFICATIONS
      // OLDER THAN 7 DAYS

      const sevenDaysAgo =
        new Date(
          Date.now() -
            3 *
              24 *
              60 *
              60 *
              1000
        );

      await Notification.deleteMany({
        createdAt: {
          $lt: sevenDaysAgo,
        },
      });

      const fields =
        await Field.find({
          user: req.user._id,
        });

      for (const field of fields) {

        // WATER ENTRY

        const lastWater =
          await FieldWater.findOne({
            field: field._id,
            user: req.user._id,
          }).sort({
            date: -1,
          });

        // FERTILIZER ENTRY

        const lastFertilizer =
          await Fertilizer.findOne({
            field: field._id,
            user: req.user._id,
          }).sort({
            date: -1,
          });

        const today =
          new Date();

        // WATER REMINDER

        if (lastWater) {

          const waterDiff =
            Math.floor(
              (
                today.getTime() -
                new Date(
                  lastWater.date
                ).getTime()
              ) /
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
            );

          if (waterDiff >= 7) {

            // CHECK EXISTING

            // CHECK LAST 24 HOURS

            const yesterday =       // 24 hrs before
              new Date(
                Date.now() -
                  24 *
                    60 *
                    60 *
                    1000
              );

            const existing =
              await Notification.findOne({
                user: req.user._id,

                title:
                  "Water Reminder",

                type: "water",

                message: {
                  $regex: field.name,
                  $options: "i",
                },

                createdAt: {
                  $gte: yesterday,
                },
              });


            if (!existing) {
              await Notification.findOneAndUpdate(
                {
                  user: req.user._id,

                  title:
                    "Water Reminder",

                  type: "water",

                  message: {
                    $regex: field.name,
                    $options: "i",
                  },

                  createdAt: {
                    $gte: yesterday,
                  },
                },

                {
                  $setOnInsert: {
                    user:
                      req.user._id,

                    title:
                      "Water Reminder",

                    message:
                      `Water reminder for ${field.name}. No water added since ${waterDiff} days.`,

                    type:
                      "water",
                  },
                },

                {
                  upsert: true,
                  new: true,
                }
              );
            }
          }
        }

        // FERTILIZER REMINDER

        if (lastFertilizer) {

          const fertilizerDiff =
            Math.floor(
              (
                today.getTime() -
                new Date(
                  lastFertilizer.date
                ).getTime()
              ) /
                (
                  1000 *
                  60 *
                  60 *
                  24
                )
            );

          if (
            fertilizerDiff >=
            25
          ) {

            const yesterday =   // 24hrs before
              new Date(
                Date.now() -
                  24 *
                    60 *
                    60 *
                    1000
              );

            const existing =
              await Notification.findOne({
                user: req.user._id,

                title:
                  "Fertilizer Reminder",

                type:
                  "fertilizer",

                message: {
                  $regex: field.name,
                  $options: "i",
                },

                createdAt: {
                  $gte: yesterday,
                },
              });

            if (!existing) {

                await Notification.findOneAndUpdate(
                  {
                    user: req.user._id,

                    title:
                      "Fertilizer Reminder",

                    type:
                      "fertilizer",

                    message: {
                      $regex: field.name,
                      $options: "i",
                    },

                    createdAt: {
                      $gte: yesterday,
                    },
                  },

                  {
                    $setOnInsert: {
                      user:
                        req.user._id,

                      title:
                        "Fertilizer Reminder",

                      message:
                        `Fertilizer reminder for ${field.name}. No fertilizer added since ${fertilizerDiff} days.`,

                      type:
                        "fertilizer",
                    },
                  },

                  {
                    upsert: true,
                    new: true,
                  }
                );
              }
          }
        }
      }

      res.status(200).json({
        success: true,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Reminder check failed",
      });
    }
  };
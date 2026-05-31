import { Response } from "express";

import Farmer from "../models/Farmer";

import Water from "../models/Water";

import { AuthRequest } from "../middleware/authMiddleware";


// DASHBOARD STATS

export const getDashboardStats =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      // TOTAL FARMERS

      const totalFarmers =
        await Farmer.countDocuments({
          user: req.user._id,
        });

      // WATER ENTRIES

      const waterEntries =
        await Water.find({
          user: req.user._id,
        });

      // TOTAL HOURS

      const totalHours =
        waterEntries.reduce(
          (
            acc: number,
            item: any
          ) => acc + item.hours,
          0
        );

      // TOTAL EARNINGS

      const totalEarnings =
        waterEntries.reduce(
          (
            acc: number,
            item: any
          ) =>
            acc +
            item.totalAmount,
          0
        );

      // TOTAL ENTRIES

      const totalEntries =
        waterEntries.length;

      // WATER RATE

      const waterRate =
        req.user.waterRate;

      res.status(200).json({
        success: true,

        data: {
          totalFarmers,

          totalEntries,

          totalHours,

          totalEarnings,

          waterRate,
        },
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard stats",
      });
    }
  };
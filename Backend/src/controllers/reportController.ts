import { Response } from "express";

import Water from "../models/Water";

import { AuthRequest } from "../middleware/authMiddleware";
import { getCache, setCache } from "../utils/redisCache";


// MONTHLY REPORT

export const getMonthlyReport =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        month,
        year,
        farmer,
      } = req.query;

      const cacheKey = `report:${req.user._id}:m=${month || ""}:y=${year || ""}:f=${farmer || ""}`;
      const cachedData = await getCache<Record<string, unknown>>(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // FILTER OBJECT

      const filter: Record<string, unknown> = {
        user: req.user._id,
      };

      // MONTH FILTER

      if (month && year) {
        const startDate =
          new Date(
            Number(year),
            Number(month) - 1,
            1
          );

        const endDate =
          new Date(
            Number(year),
            Number(month),
            1
          );

        filter.date = {
          $gte: startDate,
          $lte: endDate,
        };
      }

      // FARMER FILTER

      if (farmer) {
        filter.farmer = farmer;
      }

      // GET ENTRIES

      const entries =
        await Water.find(filter)
          .populate("farmer")
          .sort({
            date: -1,
          });

      // TOTAL HOURS

      const totalHours =
        entries.reduce(
          (
            acc: number,
            item: { hours: number }
          ) => acc + item.hours,
          0
        );

      // TOTAL EARNINGS

      const totalEarnings =
        entries.reduce(
          (
            acc: number,
            item: { totalAmount: number }
          ) => acc + item.totalAmount,
          0
        );

      const responsePayload = {
        success: true,

        totalEntries:
          entries.length,

        totalHours,

        totalEarnings,

        data: entries,
      };

      await setCache(cacheKey, responsePayload, 300);

      res.status(200).json(responsePayload);

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch report",
      });
    }
  };
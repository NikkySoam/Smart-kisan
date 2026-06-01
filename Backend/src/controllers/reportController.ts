import { Response } from "express";

import Water from "../models/Water";

import { AuthRequest } from "../middleware/authMiddleware";


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

      // FILTER OBJECT

      const filter: any = {
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
            item: any
          ) =>
            acc + item.hours,
          0
        );

      // TOTAL EARNINGS

      const totalEarnings =
        entries.reduce(
          (
            acc: number,
            item: any
          ) =>
            acc +
            item.totalAmount,
          0
        );

      res.status(200).json({
        success: true,

        totalEntries:
          entries.length,

        totalHours,

        totalEarnings,

        data: entries,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch report",
      });
    }
  };
import { Response } from "express";
import Farmer from "../models/Farmer";
import Water from "../models/Water";
import { AuthRequest } from "../middleware/authMiddleware";
import { getCache, setCache } from "../utils/redisCache";

// DASHBOARD STATS
export const getDashboardStats = async ( req: AuthRequest, res: Response ) => {
    try {
      const cacheKey = `dashboard:${req.user._id}`;
      const cachedData = await getCache<Record<string, unknown>>(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // TOTAL FARMERS
      const totalFarmers = await Farmer.countDocuments({ user: req.user._id });

      // WATER ENTRIES
      const waterEntries = await Water.find({user: req.user._id }).lean();

      // TOTAL HOURS
      const totalHours = waterEntries.reduce(
          (
            acc: number,
            item: { hours: number }
          ) => acc + item.hours,
          0
        );

      // TOTAL EARNINGS
      const totalEarnings = waterEntries.reduce((acc: number, item: { totalAmount: number }) => acc + item.totalAmount,0 );

      // TOTAL ENTRIES
      const totalEntries = waterEntries.length;

      // WATER RATE
      const waterRate = req.user.waterRate;

      // TOP WATER CONSUMER
      const topConsumerAgg = await Water.aggregate([
        { $match: { user: req.user._id } },
        {
          $group: {
            _id: "$farmer",
            totalHours: { $sum: "$hours" },
            totalAmount: { $sum: "$totalAmount" },
            totalEntries: { $sum: 1 }
          }
        },
        { $sort: { totalHours: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "farmers",
            localField: "_id",
            foreignField: "_id",
            as: "farmerDetails"
          }
        },
        { $unwind: "$farmerDetails" }
      ]);

      let topConsumer = null;
      if (topConsumerAgg.length > 0) {
        topConsumer = {
          farmerName: topConsumerAgg[0].farmerDetails.name,
          totalHours: topConsumerAgg[0].totalHours,
          totalAmount: topConsumerAgg[0].totalAmount,
          entries: topConsumerAgg[0].totalEntries,
        };
      }

      const responsePayload = {
        success: true,
        data: {
          totalFarmers,
          totalEntries,
          totalHours,
          totalEarnings,
          waterRate,
          topConsumer,
        },
      };

      await setCache(cacheKey, responsePayload, 60);

      res.status(200).json(responsePayload);

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message:
          "Failed to fetch dashboard stats",
      });
    }
  };
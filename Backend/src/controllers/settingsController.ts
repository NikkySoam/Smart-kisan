import { Response } from "express";

import User from "../models/User";

import { AuthRequest } from "../middleware/authMiddleware";


// UPDATE WATER RATE

export const updateWaterRate =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { waterRate } =
        req.body;

      // VALIDATION

      if (!waterRate) {
        return res.status(400).json({
          success: false,
          message:
            "Water rate is required",
        });
      }

      // UPDATE USER

      const user =
        await User.findByIdAndUpdate(
          req.user._id,
          {
            waterRate,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Water rate updated successfully",
        data: user,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update water rate",
      });
    }
  };



// GET CURRENT SETTINGS

export const getSettings =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const user =
        await User.findById(
          req.user._id
        );

      res.status(200).json({
        success: true,

        data: {
          waterRate:
            user?.waterRate || 0,
        },
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch settings",
      });
    }
  };
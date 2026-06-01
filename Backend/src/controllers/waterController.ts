import { Response } from "express";

import Water from "../models/Water";

import Farmer from "../models/Farmer";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD WATER ENTRY

export const addWaterEntry = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const {
      farmer,
      hours,
      date,
    } = req.body;

    // CHECK FARMER EXISTS

    const farmerExists =
        await Farmer.findOne({
            _id: farmer,
            user: req.user._id,
        });

    if (!farmerExists) {
      return res.status(404).json({
        success: false,
        message: "Farmer not found",
      });
    }

    // USER WATER RATE

    const waterRate =
      req.user.waterRate;

    // TOTAL CALCULATION

    const totalAmount =
      Number(hours) *
      Number(waterRate);

    // CREATE WATER ENTRY

    const entry = await Water.create({
      farmer,
      hours,
      date,
      totalAmount,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message:
        "Water entry added successfully",
      data: entry,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message:
        "Failed to add water entry",
    });
  }
};



// GET ALL WATER ENTRIES

export const getWaterEntries =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const entries = await Water.find({
        user: req.user._id,
      })
        .populate("farmer")
        .sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        count: entries.length,
        data: entries,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch water entries",
      });
    }
  };



// GET SINGLE FARMER WATER HISTORY

export const getFarmerWaterHistory =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { farmerId } = req.params;

      // CHECK FARMER OWNERSHIP

        const farmerExists =
        await Farmer.findOne({
            _id: farmerId,
            user: req.user._id,
        });

        if (!farmerExists) {
        return res.status(404).json({
            success: false,
            message: "Farmer not found",
        });
        }

      const entries = await Water.find({
        farmer: farmerId,
        user: req.user._id,
      })
        .populate("farmer")
        .sort({
          createdAt: -1,
        });

      // TOTAL HOURS

      const totalHours =
        entries.reduce(
          (acc: number, item: any) =>
            acc + item.hours,
          0
        );

      // TOTAL AMOUNT

      const totalAmount =
        entries.reduce(
          (acc: number, item: any) =>
            acc + item.totalAmount,
          0
        );

      res.status(200).json({
        success: true,

        totalHours,

        totalAmount,

        data: entries,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch farmer history",
      });
    }
  };



// DELETE WATER ENTRY

export const deleteWaterEntry =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const entry =
        await Water.findOne({
            _id: id,
            user: req.user._id,
        });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message:
            "Water entry not found",
        });
      }

      await Water.findByIdAndDelete(id);

      res.status(200).json({
        success: true,
        message:
          "Water entry deleted successfully",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete water entry",
      });
    }
  };

  // UPDATE WATER ENTRY

export const updateWaterEntry =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const {
        farmer,
        hours,
        date,
      } = req.body;

      const entry =
        await Water.findOne({
            _id: id,
            user: req.user._id,
        });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message:
            "Water entry not found",
        });
      }

      // RECALCULATE TOTAL

      const totalAmount =
        Number(hours) *
        Number(req.user.waterRate);

      const updatedEntry =
        await Water.findByIdAndUpdate(
          id,
          {
            farmer,
            hours,
            date,
            totalAmount,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Water entry updated successfully",
        data: updatedEntry,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update water entry",
      });
    }
  };
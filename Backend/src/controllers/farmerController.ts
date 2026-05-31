import { Response } from "express";

import Farmer from "../models/Farmer";

import Water from "../models/Water";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD FARMER

export const addFarmer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {name, phone, village} = req.body;

      const farmer =
        await Farmer.create({
          name,
          phone,
          village,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: farmer,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add farmer",
      });
    }
  };


// GET FARMERS

export const getFarmers =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const farmers =
        await Farmer.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: farmers,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch farmers",
      });
    }
  };



  // UPDATE FARMER

export const updateFarmer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const {
        name,
        phone,
        village,
      } = req.body;

      const farmer =
        await Farmer.findById(id);

      if (!farmer) {
        return res.status(404).json({
          success: false,
          message:
            "Farmer not found",
        });
      }

      const updatedFarmer =
        await Farmer.findByIdAndUpdate(
          id,
          {
            name,
            phone,
            village,
          },
          {
            new: true,
          }
        );

      res.status(200).json({
        success: true,
        message:
          "Farmer updated successfully",
        data: updatedFarmer,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update farmer",
      });
    }
  };



// DELETE FARMER

export const deleteFarmer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const { id } = req.params;

      const farmer =
        await Farmer.findById(id);

      if (!farmer) {
        return res.status(404).json({
          success: false,
          message:
            "Farmer not found",
        });
      }

      // DELETE RELATED WATER ENTRIES

      await Water.deleteMany({
        farmer: id,
      });

      // DELETE FARMER

      await Farmer.findByIdAndDelete(
        id
      );

      res.status(200).json({
        success: true,
        message:
          "Farmer deleted successfully",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete farmer",
      });
    }
  };
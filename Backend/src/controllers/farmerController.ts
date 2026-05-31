import { Response } from "express";

import Farmer from "../models/Farmer";

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
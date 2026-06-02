
import { Response } from "express";

import Fertilizer from "../models/Fertilizer";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD FERTILIZER

export const addFertilizer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        field,
        fertilizerName,
        quantity,
        cost,
        date,
      } = req.body;

      const fieldExists =
        await Field.findOne({
          _id: field,
          user: req.user._id,
        });

      if (!fieldExists) {
        return res.status(404).json({
          success: false,
          message:
            "Field not found",
        });
      }

      const fertilizer =
        await Fertilizer.create({
          field,
          fertilizerName,
          quantity,
          cost,
          date,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: fertilizer,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add fertilizer",
      });
    }
  };



// GET FERTILIZERS

export const getFertilizers =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const fertilizers =
        await Fertilizer.find({
          user: req.user._id,
        })
          .populate("field")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: fertilizers,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch fertilizers",
      });
    }
  };

  
  // GET FERTILIZER BY FIELD

export const getFertilizersByField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { fieldId } =
        req.params;

      const fertilizers =
        await Fertilizer.find({
          field: fieldId,
          user: req.user._id,
        })
          .populate("field")
          .sort({
            date: -1,
          });

      const totalCost =
        fertilizers.reduce(
          (acc, item) =>
            acc + item.cost,
          0
        );

      res.status(200).json({
        success: true,
        totalCost,
        data: fertilizers,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch fertilizers",
      });
    }
  };

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


// UPDATE FERTILIZER

export const updateFertilizer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const {
        fertilizerName,
        quantity,
        cost,
        date,
      } = req.body;

      const fertilizer =
        await Fertilizer.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!fertilizer) {
        return res.status(404).json({
          success: false,
          message:
            "Fertilizer not found",
        });
      }

      fertilizer.fertilizerName =
        fertilizerName;
      fertilizer.quantity =
        quantity;
      fertilizer.cost =
        cost;
      fertilizer.date =
        date;

      await fertilizer.save();

      res.status(200).json({
        success: true,
        data: fertilizer,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update fertilizer",
      });
    }
  };



// DELETE FERTILIZER

export const deleteFertilizer =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const fertilizer =
        await Fertilizer.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!fertilizer) {
        return res.status(404).json({
          success: false,
          message:
            "Fertilizer not found",
        });
      }

      await fertilizer.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Fertilizer deleted",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete fertilizer",
      });
    }
  };

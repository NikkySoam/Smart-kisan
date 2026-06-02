import { Response } from "express";

import FieldWater from "../models/FieldWater";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD WATER USAGE

export const addFieldWater =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        field,
        hours,
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

      const entry =
        await FieldWater.create({
          field,
          hours,
          date,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: entry,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add field water entry",
      });
    }
  };



// GET FIELD WATER

export const getFieldWater =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const entries =
        await FieldWater.find({
          user: req.user._id,
        })
          .populate("field")
          .sort({
            createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: entries,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch field water",
      });
    }
  };


  // GET WATER BY FIELD

export const getFieldWaterByField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { fieldId } =
        req.params;

      const entries =
        await FieldWater.find({
          field: fieldId,
          user: req.user._id,
        })
          .populate("field")
          .sort({
            date: -1,
          });

      const totalHours =
        entries.reduce(
          (acc, item) =>
            acc + item.hours,
          0
        );

      res.status(200).json({
        success: true,
        totalHours,
        data: entries,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch field water",
      });
    }
  };


  // UPDATE WATER ENTRY

export const updateFieldWater =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const {
        hours,
        date,
      } = req.body;

      const entry =
        await FieldWater.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message:
            "Entry not found",
        });
      }

      entry.hours = hours;
      entry.date = date;

      await entry.save();

      res.status(200).json({
        success: true,
        data: entry,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update entry",
      });
    }
  };



// DELETE WATER ENTRY

export const deleteFieldWater =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const entry =
        await FieldWater.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!entry) {
        return res.status(404).json({
          success: false,
          message:
            "Entry not found",
        });
      }

      await entry.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Entry deleted",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete entry",
      });
    }
  };
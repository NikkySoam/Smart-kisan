import { Response } from "express";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";

import FieldWater from "../models/FieldWater";

import Fertilizer from "../models/Fertilizer";

import Labour from "../models/Labour";

import Equipment from "../models/Equipment";


// ADD FIELD

export const addField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const {
        name,
        area,
        location,
        crop,
      } = req.body;

      const field =
        await Field.create({
          name,
          area,
          location,
          crop,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: field,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add field",
      });
    }
  };



// GET FIELDS

export const getFields =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {
      const fields =
        await Field.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: fields,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch fields",
      });
    }
  };

  // FIELD DETAILS

export const getFieldDetails =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } = req.params;

      // CHECK FIELD

      const field =
        await Field.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!field) {
        return res.status(404).json({
          success: false,
          message:
            "Field not found",
        });
      }

      // FETCH DATA

      const water =
        await FieldWater.find({
          field: id,
          user: req.user._id,
        });

      const fertilizers =
        await Fertilizer.find({
          field: id,
          user: req.user._id,
        });

      const labour =
        await Labour.find({
          field: id,
          user: req.user._id,
        });

      const equipment =
        await Equipment.find({
          field: id,
          user: req.user._id,
        });

      // TOTALS

      const waterTotal =
        water.reduce(
          (acc, item) =>
            acc + item.hours,
          0
        );

      const fertilizerTotal =
        fertilizers.reduce(
          (acc, item) =>
            acc + item.cost,
          0
        );

      const labourTotal =
        labour.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

      const equipmentTotal =
        equipment.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

      res.status(200).json({
        success: true,

        field,

        totals: {
          water: waterTotal,
          fertilizer:
            fertilizerTotal,
          labour: labourTotal,
          equipment:
            equipmentTotal,
        },
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch field details",
      });
    }
  };
import { Response } from "express";

import Labour from "../models/Labour";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD LABOUR

export const addLabour =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const {
        field,
        amount,
        workType,
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

      const labour =
        await Labour.create({
          field,
          amount,
          workType,
          date,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: labour,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add labour",
      });
    }
  };



// GET LABOUR BY FIELD

export const getLabourByField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { fieldId } =
        req.params;

      const labour =
        await Labour.find({
          field: fieldId,
          user: req.user._id,
        })
          .populate("field")
          .sort({
            date: -1,
          });

      const totalAmount =
        labour.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

      res.status(200).json({
        success: true,
        totalAmount,
        data: labour,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch labour",
      });
    }
  };


// UPDATE LABOUR

export const updateLabour =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const {
        amount,
        workType,
        date,
      } = req.body;

      const labour =
        await Labour.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!labour) {
        return res.status(404).json({
          success: false,
          message:
            "Labour entry not found",
        });
      }

      labour.amount = amount;
      labour.workType = workType;
      labour.date = date;

      await labour.save();

      res.status(200).json({
        success: true,
        data: labour,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update labour",
      });
    }
  };



// DELETE LABOUR

export const deleteLabour =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const labour =
        await Labour.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!labour) {
        return res.status(404).json({
          success: false,
          message:
            "Labour entry not found",
        });
      }

      await labour.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Labour entry deleted",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete labour",
      });
    }
  };

import { Response } from "express";

import Equipment from "../models/Equipment";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";


// ADD EQUIPMENT

export const addEquipment =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const {
        field,
        equipmentName,
        amount,
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

      const equipment =
        await Equipment.create({
          field,
          equipmentName,
          amount,
          date,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: equipment,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add equipment",
      });
    }
  };



// GET EQUIPMENT BY FIELD

export const getEquipmentByField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { fieldId } =
        req.params;

      const equipment =
        await Equipment.find({
          field: fieldId,
          user: req.user._id,
        })
          .populate("field")
          .sort({
            date: -1,
          });

      const totalAmount =
        equipment.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

      res.status(200).json({
        success: true,
        totalAmount,
        data: equipment,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch equipment",
      });
    }
  };


// UPDATE EQUIPMENT

export const updateEquipment =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const {
        equipmentName,
        amount,
        date,
      } = req.body;

      const equipment =
        await Equipment.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message:
            "Equipment not found",
        });
      }

      equipment.equipmentName =
        equipmentName;
      equipment.amount =
        amount;
      equipment.date =
        date;

      await equipment.save();

      res.status(200).json({
        success: true,
        data: equipment,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update equipment",
      });
    }
  };



// DELETE EQUIPMENT

export const deleteEquipment =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const equipment =
        await Equipment.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!equipment) {
        return res.status(404).json({
          success: false,
          message:
            "Equipment not found",
        });
      }

      await equipment.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Equipment deleted",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete equipment",
      });
    }
  };

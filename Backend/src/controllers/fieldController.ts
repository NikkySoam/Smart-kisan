import { Response } from "express";

import Field from "../models/Field";

import { AuthRequest } from "../middleware/authMiddleware";

import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import cloudinary from "../config/cloudinary";
import { getCache, setCache, deleteCache } from "../utils/redisCache";

import FieldWater from "../models/FieldWater";

import Fertilizer from "../models/Fertilizer";

import Labour from "../models/Labour";

import Equipment from "../models/Equipment";
import User from "../models/User";
import CropSaleReceipt from "../models/CropSaleReceipt";


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

      const file = req.file;
      let imageUrl = "";
      let cloudinaryPublicId = "";

      if (file) {
        const uploadResult = await uploadToCloudinary(
          file.buffer,
          "fields"
        );
        imageUrl = uploadResult.secure_url || "";
        cloudinaryPublicId = uploadResult.public_id || "";
      }

      const field =
        await Field.create({
          name,
          area: Number(area),
          location,
          crop,
          imageUrl,
          cloudinaryPublicId,
          user: req.user._id,
        });

      await deleteCache(`fields:${req.user._id}`);

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
      const cacheKey = `fields:${req.user._id}`;
      const cachedData = await getCache<Record<string, unknown>>(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      const fields =
        await Field.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        }).lean();

      const responsePayload = {
        success: true,
        data: fields,
      };

      await setCache(cacheKey, responsePayload, 120);

      res.status(200).json(responsePayload);

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

      const receipts = await CropSaleReceipt.find({
        field: id,
        user: req.user._id,
      });

      // TOTALS

      // USER WATER RATE

        const user =
        await User.findById(
            req.user._id
        );

        const waterHours =
        water.reduce(
            (acc, item) =>
            acc + item.hours,
            0
        );

        const waterTotal =
        waterHours *
        (user?.waterRate || 0);

            // FERTILIZER TOTAL
      const fertilizerTotal =
        fertilizers.reduce(
          (acc, item) =>
            acc + item.cost,
          0
        );

            // LABOUR TOTAL
      const labourTotal =
        labour.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

        // EQUIPMENT TOTAL
      const equipmentTotal =
        equipment.reduce(
          (acc, item) =>
            acc + item.amount,
          0
        );

        const totalExpense =
            waterTotal +
            fertilizerTotal +
            labourTotal +
            equipmentTotal;

        const totalSelling = receipts.reduce((acc, item) => acc + item.totalAmount, 0);
        const totalQuantitySold = receipts.reduce((acc, item) => acc + item.quantity, 0);

      res.status(200).json({
        success: true,

        field,

        totals: {
            water: waterTotal,
            fertilizer:fertilizerTotal,
            labour: labourTotal,
            equipment: equipmentTotal,
            totalExpense,
            totalSelling,
            totalQuantitySold
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


  // UPDATE FIELD

export const updateField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const {
        name,
        area,
        location,
        crop,
        cropSellingPrice,
      } = req.body;

      const file = req.file;

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

      if (file) {
        if (field.cloudinaryPublicId) {
          await cloudinary.uploader.destroy(
            field.cloudinaryPublicId
          );
        }

        const uploadResult = await uploadToCloudinary(
          file.buffer,
          "fields"
        );

        field.imageUrl = uploadResult.secure_url || "";
        field.cloudinaryPublicId =
          uploadResult.public_id || "";
      }

      field.name = name;
      field.area = Number(area);
      field.location = location;
      field.crop = crop;
      if (cropSellingPrice !== undefined) {
        field.cropSellingPrice = Number(cropSellingPrice);
      }

      await field.save();

      await deleteCache(`fields:${req.user._id}`);

      res.status(200).json({
        success: true,
        data: field,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update field",
      });
    }
  };



// DELETE FIELD

export const deleteField =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

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

      await field.deleteOne();

      await deleteCache(`fields:${req.user._id}`);

      res.status(200).json({
        success: true,
        message:
          "Field deleted successfully",
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to delete field",
      });
    }
  };

// GET FIELD INSIGHTS
export const getFieldInsights = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user._id);
    const waterRate = user?.waterRate || 0;

    const pipeline = [
      { $match: { user: req.user._id } },
      {
        $lookup: {
          from: "fieldwaters",
          localField: "_id",
          foreignField: "field",
          as: "waterEntries"
        }
      },
      {
        $lookup: {
          from: "fertilizers",
          localField: "_id",
          foreignField: "field",
          as: "fertilizers"
        }
      },
      {
        $lookup: {
          from: "labour",
          localField: "_id",
          foreignField: "field",
          as: "labours"
        }
      },
      {
        $lookup: {
          from: "equipment",
          localField: "_id",
          foreignField: "field",
          as: "equipments"
        }
      },
      {
        $lookup: {
          from: "cropsalereceipts",
          localField: "_id",
          foreignField: "field",
          as: "receipts"
        }
      },
      {
        $addFields: {
          waterHours: { $sum: "$waterEntries.hours" },
          fertilizerExpense: { $sum: "$fertilizers.cost" },
          labourExpense: { $sum: "$labours.amount" },
          equipmentExpense: { $sum: "$equipments.amount" },
          totalRevenue: { $sum: "$receipts.totalAmount" }
        }
      },
      {
        $addFields: {
          waterExpense: { $multiply: ["$waterHours", waterRate] }
        }
      },
      {
        $addFields: {
          totalExpense: {
            $add: ["$waterExpense", "$fertilizerExpense", "$labourExpense", "$equipmentExpense"]
          }
        }
      },
      {
        $addFields: {
          netProfit: { $subtract: ["$totalRevenue", "$totalExpense"] },
          profitPerArea: {
            $cond: {
              if: { $gt: ["$area", 0] },
              then: {
                $divide: [
                  { $subtract: ["$totalRevenue", "$totalExpense"] },
                  "$area"
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $project: {
          name: 1,
          crop: 1,
          area: 1,
          waterExpense: 1,
          fertilizerExpense: 1,
          labourExpense: 1,
          equipmentExpense: 1,
          totalExpense: 1,
          totalRevenue: 1,
          netProfit: 1,
          profitPerArea: 1,
          createdAt: 1
        }
      }
    ];

    const aggregatedFields = await Field.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: aggregatedFields,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch field insights",
    });
  }
};
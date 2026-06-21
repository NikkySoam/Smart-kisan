import { Response } from "express";
import Crop from "../models/Crop";
import { AuthRequest } from "../middleware/authMiddleware";


// ADD CROP
export const addCrop = async ( req: AuthRequest, res: Response ) => {
    try {
      const { name,season,area } = req.body;

      const crop = await Crop.create({
          name,
          season,
          area,
          user: req.user._id,
        });

      res.status(201).json({
        success: true,
        data: crop,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to add crop",
      });
    }
  };



// GET CROPS

export const getCrops = async ( req: AuthRequest, res: Response) => {
    try {
      const crops = await Crop.find({ 
        user: req.user._id,
        }).sort({
          createdAt: -1,
          });

      res.status(200).json({
        success: true,
        data: crops,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch crops",
      });
    }
  };
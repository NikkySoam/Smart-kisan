import { Response } from "express";

import Notification from "../models/Notification";

import { AuthRequest } from "../middleware/authMiddleware";


// GET NOTIFICATIONS

export const getNotifications =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const notifications =
        await Notification.find({
          user: req.user._id,
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,
        data: notifications,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to fetch notifications",
      });
    }
  };



// MARK AS READ

export const markAsRead =
  async (
    req: AuthRequest,
    res: Response
  ) => {
    try {

      const { id } =
        req.params;

      const notification =
        await Notification.findOne({
          _id: id,
          user: req.user._id,
        });

      if (!notification) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      notification.isRead = true;

      await notification.save();

      res.status(200).json({
        success: true,
      });

    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,
        message:
          "Failed to update notification",
      });
    }
  };
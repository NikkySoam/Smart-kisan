import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import User from "../models/User";

import generateToken from "../utils/generateToken";


// REGISTER

export const registerController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      name,
      phone,
      pin,
      confirmPin,
    } = req.body;

    // CHECK PIN LENGTH

    if (pin.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "PIN must be at least 6 digits",
      });
    }
    
    // CHECK PIN MATCH

    if (pin !== confirmPin) {
      return res.status(400).json({
        success: false,
        message:
          "PIN and Confirm PIN do not match",
      });
    }


    // CHECK EXISTING USER

    const existingUser =
      await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Phone number already exists",
      });
    }

    // HASH PIN

    const hashedPin =
      await bcrypt.hash(pin, 10);

    // CREATE USER

    const user = await User.create({
      name,
      phone,
      pin: hashedPin,
    });

    // GENERATE TOKEN

    const token = generateToken(
      user._id.toString()
    );

    res.status(201).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Registration Failed",
    });
  }
};

// LOGIN

export const loginController = async (
  req: Request,
  res: Response
) => {
  try {
    const { phone, pin } = req.body;

    // FIND USER

    const user = await User.findOne({
      phone,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // MATCH PIN

    const isMatch =
      await bcrypt.compare(
        pin,
        user.pin
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // TOKEN

    const token = generateToken(
      user._id.toString()
    );

    res.status(200).json({
      success: true,
      token,
      user,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Login Failed",
    });
  }
};
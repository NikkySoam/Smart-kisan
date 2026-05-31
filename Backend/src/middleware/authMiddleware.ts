import { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import User from "../models/User";

interface JwtPayload {
  id: string;
}

export interface AuthRequest extends Request {
  user?: any;
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith(
        "Bearer"
      )
    ) {
      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      req.user = await User.findById(
        decoded.id
      );

      next();

    } else {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

  } catch (error) {
    return res.status(401).json({
      message: "Token Failed",
    });
  }
};

export default protect;
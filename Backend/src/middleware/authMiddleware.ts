import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel, { User as IUser } from "../models/User";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user: IUser;
    }
  }
}

interface JwtPayload { id: string }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface AuthRequest extends Request {}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {

  try {
    let token;

    if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

      token =
        req.headers.authorization.split(
          " "
        )[1];

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as JwtPayload;

      const user = await UserModel.findById( decoded.id);
      
      if (!user) {
        return res.status(401).json({
          message: "Not Authorized",
        });
      }

      req.user = user;

      next();
    } else {
      return res.status(401).json({
        message: "Not Authorized",
      });
    }

  } catch {
    return res.status(401).json({
      message: "Token Failed",
    });
  }
};

export default protect;
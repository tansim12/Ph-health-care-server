import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

import { StatusCodes } from "http-status-codes";

import prisma from "../shared/prisma";
import { User, UserRole, UserStatus } from "@prisma/client";
import ApiError from "../Error-Handler/ApiError";
import config from "../config";

dotenv.config();

const handleUnauthorizedError = (message: string, next: NextFunction) => {
  const error = new ApiError(StatusCodes.UNAUTHORIZED, message);
  next(error);
};

export const authMiddleWare = (...requiredRoles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      
      if (!token) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }

      const decoded = jwt.verify(
        token as string,
        config.jwt.jwt_secret as string
      ) as JwtPayload;
 
      const { role, email } = decoded;
      const user = await prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });
    
      if (user?.isDelete) {
        return next(
          new ApiError(StatusCodes.BAD_REQUEST, "This User Already Deleted !")
        );
      }

      if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
        return handleUnauthorizedError(
          "You have no access to this route",
          next
        );
      }
      const data = {
        id: user?.id,
        role:user?.role,
        email:user?.email
      };
   
      req.user = data;
      next();
    } catch (error) {
      return handleUnauthorizedError("You have no access to this route", next);
    }
  };
};

import { Request, RequestHandler, Response } from "express";

import { AuthServices } from "./Auth.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const loginUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await AuthServices.loginUser(req.body);

    const { refreshToken } = result;

    res.cookie("refreshToken", refreshToken, {
      secure: false,
      httpOnly: true,
    });
    res.send(
      successResponse(
        {
          accessToken: result.accessToken,
          needPasswordChange: result.needPasswordChange,
        },
        StatusCodes.OK,
        "Logged in successfully!"
      )
    );
  } catch (error) {
    next(error);
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const result = await AuthServices.refreshToken(refreshToken);
    res.send(successResponse(result, StatusCodes.OK, "refresh token send"));
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  loginUser,
  refreshToken,
};
import { RequestHandler } from "express";
import { doctorService } from "./Doctor.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const doctorInfoUpdateSpecialtiesCreateAndUpdate: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await doctorService.doctorInfoUpdateSpecialtiesCreateAndUpdateDB(
        req?.params?.doctorId,
        req?.body
      );
    res.send(successResponse(result, StatusCodes.OK, "Doctor Updated"));
  } catch (error) {
    next(error);
  }
};

export const doctorController = {
  doctorInfoUpdateSpecialtiesCreateAndUpdate,
};

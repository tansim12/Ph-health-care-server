import { RequestHandler } from "express";
import { doctorService } from "./Doctor.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";
import { doctorFilterableFields } from "./Doctor.const";
import pick from "../../shared/pick";

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

const findAllDoctor: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, doctorFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctorService.findAllDoctorDB(filters, options);
    res.send(successResponse(result, 200, "Find all admin  Successfully Done"));
  } catch (error) {
    next(error);
  }
};

export const doctorController = {
  doctorInfoUpdateSpecialtiesCreateAndUpdate,
  findAllDoctor,
};

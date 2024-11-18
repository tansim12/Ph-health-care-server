import { RequestHandler } from "express";
import { specialtiesService } from "./Specialities.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const createSpecialties: RequestHandler = async (req, res, next) => {
  const result = await specialtiesService.createSpecialtiesDB(
    req?.user.id,
    req?.body
  );
  res.send(
    successResponse(
      result,
      StatusCodes.OK,
      "Specialties create successfully done here"
    )
  );
  try {
  } catch (error) {
    next(error);
  }
};

export const specialtiesController = {
  createSpecialties,
};

import { RequestHandler } from "express";
import { specialtiesService } from "./Specialities.service";
import { successResponse } from "../../Re-useable/successResponse";
import { StatusCodes } from "http-status-codes";

const createSpecialties: RequestHandler = async (req, res, next) => {
  let body = req.body;
  if (req?.file?.path) {
    body = { ...body, icon: req.file.path };
  }
  const result = await specialtiesService.createSpecialtiesDB(
    req?.user.id,
    body
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

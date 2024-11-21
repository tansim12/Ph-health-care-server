import { RequestHandler } from "express";
import { scheduleService } from "./Schedule.service";
import { successResponse } from "../../Re-useable/successResponse";

const scheduleCreate: RequestHandler = async (req, res, next) => {
  try {
    const result = await scheduleService.scheduleCreateDB(req?.body);
    res.send(successResponse(result, 200, "Schedule create Successfully Done"));
  } catch (error) {
    next(error);
  }
};

export const scheduleController = {
  scheduleCreate,
};

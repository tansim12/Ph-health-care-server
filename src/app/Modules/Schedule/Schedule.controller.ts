import { RequestHandler } from "express";
import { scheduleService } from "./Schedule.service";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { scheduleFilterableFields } from "./Schedule.const";

const scheduleCreate: RequestHandler = async (req, res, next) => {
  try {
    const result = await scheduleService.scheduleCreateDB(req?.body);
    res.send(successResponse(result, 200, "Schedule create Successfully Done"));
  } catch (error) {
    next(error);
  }
};

const findAllSchedule: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, scheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await scheduleService.findAllScheduleDB(filters, options);
    res.send(
      successResponse(result, 200, "Find all schedule  Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};

export const scheduleController = {
  scheduleCreate,
  findAllSchedule,
};

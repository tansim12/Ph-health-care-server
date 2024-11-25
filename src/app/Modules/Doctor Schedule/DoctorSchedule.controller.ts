import { RequestHandler } from "express";

import { successResponse } from "../../Re-useable/successResponse";
import { doctorScheduleService } from "./DoctorSchedule.service";
import pick from "../../shared/pick";
import { doctorScheduleFilterableFields } from "./DoctorSchedule.const";

const doctorScheduleCreate: RequestHandler = async (req, res, next) => {
  try {
    const result = await doctorScheduleService.doctorCreateScheduleDB(
      req?.user?.email,
      req?.body
    );
    res.send(
      successResponse(result, 200, "Doctor Schedule create Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};

const findAllDoctorSchedule: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, doctorScheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctorScheduleService.findAllDoctorScheduleDB(
      filters,
      options
    );
    res.send(
      successResponse(result, 200, "Find doctor schedule  Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};
const findSingleDoctorSchedule: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, doctorScheduleFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await doctorScheduleService.findSingleDoctorScheduleDB(
      filters,
      options,
      req?.user?.email
    );
    res.send(
      successResponse(result, 200, "Find doctor schedule  Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};
const deleteSingleDoctorSchedule: RequestHandler = async (req, res, next) => {
  try {
    const result = await doctorScheduleService.deleteSingleDoctorScheduleDB(
      req?.user?.email,
      req?.params.scheduleId
    );
    res.send(
      successResponse(result, 200, "Delete doctor schedule  Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};

export const doctorScheduleController = {
  doctorScheduleCreate,
  findSingleDoctorSchedule,
  deleteSingleDoctorSchedule,
  findAllDoctorSchedule,
};

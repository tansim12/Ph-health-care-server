import { RequestHandler } from "express";

import { successResponse } from "../../Re-useable/successResponse";
import { doctorScheduleService } from "./DoctorSchedule.service";

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

export const doctorScheduleController = {
  doctorScheduleCreate,
};

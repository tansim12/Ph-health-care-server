import { RequestHandler } from "express";
import { appointmentService } from "./Appointment.service";
import { successResponse } from "../../Re-useable/successResponse";

const createAppointment: RequestHandler = async (req, res, next) => {
  try {
    const result = await appointmentService.createAppointmentDB(
      req?.user?.email,
      req.body
    );
    res.send(
      successResponse(result, 200, "Appointment Create Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};

export const appointmentController = {
  createAppointment,
};

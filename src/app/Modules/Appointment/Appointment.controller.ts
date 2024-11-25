import { RequestHandler } from "express";
import { appointmentService } from "./Appointment.service";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { appointmentFilterableFields } from "./Appointment.const";

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
const findPatientMyAppointment: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointmentService.findPatientMyAppointmentDB(
      filters,
      options,
      req?.user?.email
    );
    res.send(
      successResponse(result, 200, "Patient Appointment data Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};
const findDoctorMyAppointment: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, appointmentFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await appointmentService.findDoctorMyAppointmentDB(
      filters,
      options,
      req?.user?.email
    );
    res.send(
      successResponse(result, 200, "Doctor Appointment data Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};

export const appointmentController = {
  createAppointment,
  findPatientMyAppointment,
  findDoctorMyAppointment,
};

import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
import { appointmentController } from "./Appointment.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.PATIENT),
  appointmentController.createAppointment
);
router.get(
  "/",
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  // appointmentController.findAllAppointment
);
router.get(
  "/patient/my-appointments",
  authMiddleWare(UserRole.PATIENT),
  appointmentController.findPatientMyAppointment
);
router.get(
  "/doctor/my-appointments",
  authMiddleWare(UserRole.DOCTOR),
  appointmentController.findDoctorMyAppointment
);

export const appointmentRouter = router;

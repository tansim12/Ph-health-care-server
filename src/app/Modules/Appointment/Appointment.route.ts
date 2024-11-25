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
  "/patient/my-appointments",
  authMiddleWare(UserRole.PATIENT),
  appointmentController.findPatientMyAppointment
);

export const appointmentRouter = router;

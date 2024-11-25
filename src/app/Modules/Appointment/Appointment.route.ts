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

export const appointmentRouter = router;

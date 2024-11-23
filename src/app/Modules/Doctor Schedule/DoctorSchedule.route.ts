import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
import { doctorScheduleController } from "./DoctorSchedule.controller";

const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.DOCTOR),
  doctorScheduleController.doctorScheduleCreate
);
router.get(
  "/my-schedule",
  authMiddleWare(UserRole.DOCTOR),
  doctorScheduleController.findSingleDoctorSchedule
);

export const doctorScheduleRouter = router;

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
  "/",
  authMiddleWare(UserRole.DOCTOR, UserRole.ADMIN, UserRole.SUPER_ADMIN,UserRole.PATIENT),
  doctorScheduleController.findAllDoctorSchedule
);
router.get(
  "/my-schedule",
  authMiddleWare(UserRole.DOCTOR),
  doctorScheduleController.findSingleDoctorSchedule
);
router.delete(
  "/:scheduleId",
  authMiddleWare(UserRole.DOCTOR),
  doctorScheduleController.deleteSingleDoctorSchedule
);

export const doctorScheduleRouter = router;

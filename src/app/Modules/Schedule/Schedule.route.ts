import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
import { scheduleController } from "./Schedule.controller";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  scheduleController.scheduleCreate
);
router.get(
  "/",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  scheduleController.findAllSchedule
);

export const scheduleRouter = router;

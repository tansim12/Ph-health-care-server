import express from "express";
import { doctorController } from "./Doctor.controller";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
const router = express.Router();

router.put(
  "/create-and-update-specialties/:doctorId",
  authMiddleWare(UserRole.ADMIN, UserRole.DOCTOR, UserRole.SUPER_ADMIN),
  doctorController.doctorInfoUpdateSpecialtiesCreateAndUpdate
);

router.get("/", doctorController.findAllDoctor);

export const doctorRouter = router;

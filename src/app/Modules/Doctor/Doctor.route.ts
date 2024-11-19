import express from "express";
import { doctorController } from "./Doctor.controller";
const router = express.Router();

router.put(
  "/create-and-update-specialties/:doctorId",
  doctorController.doctorInfoUpdateSpecialtiesCreateAndUpdate
);

export const doctorRouter = router;

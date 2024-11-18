import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
import { specialtiesController } from "./Specialities.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { specialtiesZodSchemas } from "./Specialities.zodValidation";
const router = express.Router();

router.post(
  "/",
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  validationMiddleWare(specialtiesZodSchemas.createSpecialtiesZodSchema),
  specialtiesController.createSpecialties
);

export const specialtiesRouter = router;

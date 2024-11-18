import express from "express";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";
import { specialtiesController } from "./Specialities.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { specialtiesZodSchemas } from "./Specialities.zodValidation";
import { multerUpload } from "../../config/multer.config";
import { jsonDataSetMiddleware } from "../../middleware/jsonDataSetMiddleware";
const router = express.Router();

router.post(
  "/",
  multerUpload.single("image"),
  jsonDataSetMiddleware,
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  validationMiddleWare(specialtiesZodSchemas.createSpecialtiesZodSchema),
  specialtiesController.createSpecialties
);
router.get(
  "/",
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.DOCTOR),
  specialtiesController.findAllSpecialties
);

export const specialtiesRouter = router;

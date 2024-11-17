import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { multerUpload } from "../../config/multer.config";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { adminZodValidation } from "../Admin/Admin.ZodValidation";
import { userZodValidation } from "./User.ZodValidation";
import { jsonDataSetMiddleware } from "../../middleware/jsonDataSetMiddleware";

const router = express.Router();

router.get(
  "/",
  // authMiddleWare( UserRole.SUPER_ADMIN),
  userController.getAllUsers
);
router.post("/", userController.createUser);
router.post(
  "/create-admin",
  multerUpload.single('image'),
  jsonDataSetMiddleware,
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationMiddleWare(userZodValidation.createAdminZodSchema),
  userController.adminCreate
);
router.post(
  "/create-doctor",
  multerUpload.single('image'),
  jsonDataSetMiddleware,
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validationMiddleWare(userZodValidation.createDoctorZodSchema),
  userController.createDoctor
);
router.post(
  "/create-patient",
  multerUpload.single('image'),
  jsonDataSetMiddleware,
  validationMiddleWare(userZodValidation.createPatientZodSchema),
  userController.createPatient
);

export const userRouter = router;

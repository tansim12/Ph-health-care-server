import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

router.get(
  "/",
  authMiddleWare( UserRole.SUPER_ADMIN),
  userController.getAllUsers
);
router.post("/", userController.createUser);
router.post(
  "/create-admin",
  multerUpload.single('image'),
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.adminCreate
);
router.post(
  "/create-doctor",
  multerUpload.single('image'),
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.createDoctor
);

export const userRouter = router;

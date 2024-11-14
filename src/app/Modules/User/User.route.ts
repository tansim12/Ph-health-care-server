import express from "express";
import { userController } from "./User.controller";

import { UserRole } from "@prisma/client";
import { authMiddleWare } from "../../middleware/authMiddleWare";

const router = express.Router();

router.get(
  "/",
  authMiddleWare( UserRole.SUPER_ADMIN),
  userController.getAllUsers
);
router.post("/", userController.createUser);
router.post(
  "/create-admin",
  authMiddleWare(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  userController.adminCreate
);

export const userRouter = router;

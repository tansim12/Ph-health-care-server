import express from "express";
import { AuthController } from "./Auth.controller";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/login", AuthController.loginUser);

router.post("/refresh-token", AuthController.refreshToken);
router.post(
  "/forget-password",
  authMiddleWare(
    UserRole.ADMIN,
    UserRole.DOCTOR,
    UserRole.PATIENT,
    UserRole.SUPER_ADMIN
  ),
  AuthController.forgotPassword
);

export const AuthRoutes = router;

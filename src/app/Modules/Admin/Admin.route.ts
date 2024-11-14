import express from "express";
import { adminController } from "./Admin.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { adminZodValidation } from "./Admin.ZodValidation";
import { authMiddleWare } from "../../middleware/authMiddleWare";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.findAllAdmin
);
router.get(
  "/:id",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.getSingleAdmin
);
router.put(
  "/:id",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validationMiddleWare(adminZodValidation.updateAdminZodSchema),
  adminController.updateAdminInfo
);
router.delete(
  "/:id",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.deleteUserAndAdmin
);
router.delete(
  "/soft-delete/:id",
  authMiddleWare(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  adminController.softDeleteUserAndAdmin
);

export const adminRouter = router;

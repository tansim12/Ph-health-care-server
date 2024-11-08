import express from "express";
import { adminController } from "./Admin.controller";
import validationMiddleWare from "../../middleware/validationMiddleWare";
import { adminZodValidation } from "./Admin.ZodValidation";

const router = express.Router();

router.get("/", adminController.findAllAdmin);
router.get("/:id", adminController.getSingleAdmin);
router.put(
  "/:id",
  validationMiddleWare(adminZodValidation.updateAdminZodSchema),
  adminController.updateAdminInfo
);
router.delete("/:id", adminController.deleteUserAndAdmin);
router.delete("/soft-delete/:id", adminController.softDeleteUserAndAdmin);

export const adminRouter = router;

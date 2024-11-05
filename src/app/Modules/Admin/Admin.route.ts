import express from "express";
import { adminController } from "./Admin.controller";

const router = express.Router();

router.get("/", adminController.findAllAdmin);
router.get("/:id", adminController.getSingleAdmin);
router.put("/:id", adminController.updateAdminInfo);

export const adminRouter = router;

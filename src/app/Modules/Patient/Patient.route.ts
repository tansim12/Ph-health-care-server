import express from "express";
import { patientController } from "./Patient.controller";

const router = express.Router();

router.get("/", patientController.findAllPatient);

router.get("/:id", patientController.getSinglePatient);

// router.patch(
//     '/:id',
//     PatientController.updateIntoDB
// );

router.delete("/:id", patientController.permanentDeletePatient);
router.delete("/soft/:id", patientController.sortDeletePatient);

export const patientRoutes = router;

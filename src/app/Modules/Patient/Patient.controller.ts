import { RequestHandler } from "express";
import pick from "../../shared/pick";
import { patientFilterableFields } from "./Patient.const";
import { patientService } from "./Patient.service";
import { successResponse } from "../../Re-useable/successResponse";

const findAllPatient: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, patientFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await patientService.findAllPatientDB(filters, options);
    res.send(
      successResponse(result, 200, "Find all patient  Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};
const getSinglePatient: RequestHandler = async (req, res, next) => {
  try {
    const result = await patientService.getSinglePatientDB(req?.params.id);
    res.send(
      successResponse(result, 200, "Find single patient data Successfully Done")
    );
  } catch (error) {
    next(error);
  }
};
const permanentDeletePatient: RequestHandler = async (req, res, next) => {
  try {
    const result = await patientService.permanentDeletePatientDB(
      req?.params.id
    );
    res.send(
      successResponse(
        result,
        200,
        "single patient data permanent delete Successfully Done"
      )
    );
  } catch (error) {
    next(error);
  }
};
const sortDeletePatient: RequestHandler = async (req, res, next) => {
  try {
    const result = await patientService.sortDeletePatientDB(req?.params.id);
    res.send(
      successResponse(
        result,
        200,
        "single patient data soft delete Successfully Done"
      )
    );
  } catch (error) {
    next(error);
  }
};

export const patientController = {
  findAllPatient,
  getSinglePatient,
  permanentDeletePatient,
  sortDeletePatient,
};

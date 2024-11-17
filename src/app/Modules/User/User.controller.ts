import { RequestHandler } from "express";
import { userService } from "./User.service";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { userFilterAbleFields } from "./User.const";

const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, userFilterAbleFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await userService.getAllUsersDB(filters, options);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

const createUser: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.createUserDB(req?.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
const adminCreate: RequestHandler = async (req, res, next) => {
  let adminData = req.body.admin;
  if (req?.file?.path) {
    adminData = { ...adminData, profilePhoto: req.file.path };
  }

  const bodyData = {
    password: req.body.password, // Extract password
    admin: {
      ...adminData, // Include the updated admin data
    },
  };
  try {
    const result = await userService.adminCreateDB(bodyData);
    res.send(successResponse(result, 200, "Admin Create Successfully done"));
  } catch (error) {
    next(error);
  }
};
const createDoctor: RequestHandler = async (req, res, next) => {
  let doctorData = req.body.doctor;
  if (req?.file?.path) {
    doctorData = { ...doctorData, profilePhoto: req.file.path };
  }
  const bodyData = {
    password: req.body.password, // Extract password
    doctor: {
      ...doctorData, // Include the updated admin data
    },
  };
  try {
    const result = await userService.createDoctorDB(bodyData);
    res.send(successResponse(result, 200, "Doctor Create Successfully done"));
  } catch (error) {
    next(error);
  }
};
const createPatient: RequestHandler = async (req, res, next) => {
  let patientData = req.body.patient;
  if (req?.file?.path) {
    patientData = { ...patientData, profilePhoto: req.file.path };
  }
  const bodyData = {
    password: req.body.password, // Extract password
    patient: {
      ...patientData, // Include the updated admin data
    },
  };
  try {
    const result = await userService.createPatientDB(bodyData);
    res.send(successResponse(result, 200, "Patient Create Successfully done"));
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getAllUsers,
  createUser,
  adminCreate,
  createDoctor,
  createPatient,
};

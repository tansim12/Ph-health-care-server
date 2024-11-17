import { RequestHandler } from "express";
import { userService } from "./User.service";
import { successResponse } from "../../Re-useable/successResponse";

const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const result = await userService.getAllUsersDB();
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
  let adminData = JSON.parse(req.body.data).admin;
  if (req?.file?.path) {
    adminData = { ...adminData, profilePhoto: req.file.path };
  }

  const bodyData = {
    password: JSON.parse(req.body.data).password, // Extract password
    admin: {
      ...adminData, // Include the updated admin data
    },
  };
  try {
    const result = await userService.adminCreateDB(bodyData);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
const createDoctor: RequestHandler = async (req, res, next) => {
  let doctorData = JSON.parse(req.body.data).doctor;
  if (req?.file?.path) {
    doctorData = { ...doctorData, profilePhoto: req.file.path };
  }
  const bodyData = {
    password: JSON.parse(req.body.data).password, // Extract password
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

export const userController = {
  getAllUsers,
  createUser,
  adminCreate,
  createDoctor,
};

import { RequestHandler } from "express";
import { userService } from "./User.service";

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
  try {
    const result = await userService.adminCreateDB(req?.body);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};

export const userController = {
  getAllUsers,
  createUser,
  adminCreate,
};

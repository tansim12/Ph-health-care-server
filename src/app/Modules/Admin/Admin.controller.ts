import { RequestHandler } from "express";
import { adminService } from "./Admin.service";
import { successResponse } from "../../Re-useable/successResponse";
import pick from "../../shared/pick";
import { adminFilterableFields } from "./Admin.const";

const findAllAdmin: RequestHandler = async (req, res, next) => {
  try {
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const result = await adminService.findAllAdminDB(filters, options);
    res
      .status(200)
      .send(successResponse(result, 200, "Find all admin  Successfully Done"));
  } catch (error) {
    next(error);
  }
};
const getSingleAdmin: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.getSingleAdminDB(req?.params?.id);
    res
      .status(200)
      .send(
        successResponse(result, 200, "Find single admin  successfully done")
      );
  } catch (error) {
    next(error);
  }
};
const updateAdminInfo: RequestHandler = async (req, res, next) => {
  try {
    const result = await adminService.updateAdminInfoDB(req?.params?.id,req?.body);
    res
      .status(200)
      .send(
        successResponse(result, 200, "Find single admin data update  successfully done")
      );
  } catch (error) {
    next(error);
  }
};

export const adminController = {
  findAllAdmin,
  getSingleAdmin,
  updateAdminInfo
};

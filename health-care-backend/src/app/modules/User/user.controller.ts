// * all req,res will work here
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { userFilterAbleFileds } from "./user.constant";
import { userService } from "./user.service";

const createAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createAdmin(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created Successfully!",
    data: result,
  });
});

const createDoctor: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createDoctor(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Doctor created Successfully!",
    data: result,
  });
});

const createPatient: RequestHandler = catchAsync(async (req, res) => {
  const result = await userService.createPatient(req);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Patient created Successfully!",
    data: result,
  });
});

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
  const safeQuery = pick(req.query, userFilterAbleFileds);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await userService.getAllFromDB(safeQuery, options);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User Data Fetched Successfully!",
    meta: result.meta,
    data: result.data,
  });
});

const changeProfileStatus = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await userService.changeProfileStatus(id as string, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Profile Status Updated Successfully!",
    data: result,
  });
});

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
};

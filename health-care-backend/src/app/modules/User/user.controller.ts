// * all req,res will work here
import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import catchAsync from "../../../shared/catchAsync";
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

export const userController = {
  createAdmin,
  createDoctor,
  createPatient,
};

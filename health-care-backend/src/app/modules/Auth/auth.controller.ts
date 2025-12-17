import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import { StatusCodes } from "http-status-codes";

const loginUser = catchAsync(async (req:Request,res:Response)=>{
  const result = await authServices.loginUserService();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
})


export const authController = {
  loginUser,
};

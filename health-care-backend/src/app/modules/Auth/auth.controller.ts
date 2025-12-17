import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import catchAsync from "../../../shared/catchAsync";
import { authServices } from "./auth.service";

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.loginUserService(req.body);
  const { accessToken, refreshToken } = result;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

export const authController = {
  loginUser,
};

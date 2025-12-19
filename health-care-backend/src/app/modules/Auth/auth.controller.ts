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

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await authServices.refreshTokenService(refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await authServices.changePasswordService(user, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Password changed successfully",
      data: result,
    });
  }
);

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const user = req.body;
  const result = await authServices.forgotPasswordService(user);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
};

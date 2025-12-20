import { UserStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { SignOptions } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import ApiError from "../../errors/ApiError";
import emailSender from "./emailSender";

const loginUserService = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(401, "Password is incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiresIn as SignOptions["expiresIn"]
  );
  const refreshToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as string,
    config.jwt.refresh_token_expiresIn as SignOptions["expiresIn"]
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshTokenService = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_token_secret as string
    );
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.jwt_expiresIn as SignOptions["expiresIn"]
  );
  return {
    accessToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const changePasswordService = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
      status: UserStatus.ACTIVE,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new ApiError(401, "Old password is incorrect");
  }
  const hashedPassword: string = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password changed successfully",
  };
};

const forgotPasswordService = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  if (!userData) {
    throw new ApiError(401, "User not found");
  }
  const resetPasswordToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    config.jwt.reset_password_token_secret as string,
    config.jwt.reset_password_token_expiresIn as SignOptions["expiresIn"]
  );
  const resetPasswordLink =
    config.reset_password_link +
    `?userId=${userData.id}&token=${resetPasswordToken}`;

  await emailSender(
    userData.email,
    `
      <div>
      <p>Dear User,</p>
      <p>Your password reset link
       <a href="${resetPasswordLink}">
       <button>Reset Password</button>
       </a>
       </p>
      </div>`
  );
};

const resetPasswordService = async (
  token: string,
  payload: { id: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      id: payload.id,
      status: UserStatus.ACTIVE,
    },
  });
  const isValidToken = jwtHelpers.verifyToken(
    token,
    config.jwt.reset_password_token_secret as string
  );
  if (!isValidToken) {
    throw new ApiError(401, "Invalid token");
  }
  const hashedPassword: string = await bcrypt.hash(payload.password, 10);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    message: "Password reset successfully",
  };
};

export const authServices = {
  loginUserService,
  refreshTokenService,
  changePasswordService,
  forgotPasswordService,
  resetPasswordService,
};

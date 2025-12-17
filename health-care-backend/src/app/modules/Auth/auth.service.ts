import bcrypt from "bcrypt";

import generateToken from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";

const loginUserService = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password is incorrect");
  }

  const accessToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "nextLevelAccessSecretKey",
    "15m"
  );
  const refreshToken = generateToken(
    {
      email: userData.email,
      role: userData.role,
    },
    "nextLevelRefreshSecretKey",
    "30d"
  );
  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

export const authServices = {
  loginUserService,
};

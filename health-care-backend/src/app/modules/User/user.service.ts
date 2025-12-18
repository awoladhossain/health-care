import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 10);
  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = {
    ...data.admin,
    // user: { connect: { email: data.admin.email } },
  };
  const [createdUser, createdAdmin] = await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.admin.create({ data: adminData }),
  ]);
  return { createdUserData: createdUser, createdAdminData: createdAdmin };
};

export const userService = {
  createAdmin,
};

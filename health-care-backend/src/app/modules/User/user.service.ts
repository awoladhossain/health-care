import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const createAdmin = async (data: any) => {
  const hashedPassword: string = await bcrypt.hash(data.password, 10);

  console.log({ hashedPassword });

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  console.log("this is user data: ", userData);

  const adminData = {
    ...data.admin,
    // user: { connect: { email: data.admin.email } },
  };
  console.log("this is admin data: ", adminData);

  const [createdUser, createdAdmin] = await prisma.$transaction([
    prisma.user.create({ data: userData }),
    prisma.admin.create({ data: adminData }),
  ]);
  return { createdUserData: createdUser, createdAdminData: createdAdmin };
};

export const userService = {
  createAdmin,
};

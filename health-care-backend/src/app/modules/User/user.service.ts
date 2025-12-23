import { UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";

const createAdmin = async (req: any) => {
  const file: IFile = req.file;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.admin.profilePhoto = uploadToCloudinary?.secure_url;
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };
  const adminData = {
    ...req.body.admin,
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

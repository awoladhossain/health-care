import { Doctor, Patient, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request } from "express";
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

const createDoctor = async (req: Request): Promise<Doctor> => {
  const file: IFile = req.file as IFile;

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.doctor.profilePhoto = uploadToCloudinary?.secure_url;
    // console.log(req.body.doctor.profilePhoto);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.doctor.email,
    password: hashedPassword,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createDoctor = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return createDoctor;
  });

  return result;
};

const createPatient = async (req: Request): Promise<Patient> => {
  const file: IFile = req.file as IFile;
  console.log(file);

  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.patient.profilePhoto = uploadToCloudinary?.secure_url;
    // console.log(req.body.doctor.profilePhoto);
  }

  const hashedPassword: string = await bcrypt.hash(req.body.password, 10);
  const userData = {
    email: req.body.patient.email,
    password: hashedPassword,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return createPatient;
  });

  return result;
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
};

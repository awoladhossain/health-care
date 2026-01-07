import { Doctor, Patient, Prisma, UserRole } from "@prisma/client";
import bcrypt from "bcrypt";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IFile } from "../../interfaces/file";
import { IPaginationOptions } from "../../interfaces/pagination";
import { userSearchAbleFields } from "./user.constant";

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

const getAllFromDB = async (params: any, options: IPaginationOptions) => {
  const { searchTerm, ...rest } = params;

  const { limit, page, skip } = calculatePagination(options);
  const addCondition: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    addCondition.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  if (Object.keys(rest).length > 0) {
    addCondition.push({
      AND: Object.keys(rest).map((key) => ({
        [key]: {
          equals: (rest as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput =
    addCondition.length > 0 ? { AND: addCondition } : {};
  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    select: {
      id: true,
      email: true,
      role: true,
      status: true,
      needPasswordChange: true,
      createdAt: true,
      updatedAt: true,
      // admin: true,
      // patient: true,
      // doctor: true,
    },
  });
  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const changeProfileStatus = async (id: string, data: { status: UserRole }) => {
  console.log(id, data);
};

export const userService = {
  createAdmin,
  createDoctor,
  createPatient,
  getAllFromDB,
  changeProfileStatus,
};

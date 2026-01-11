import { Specialties } from "@prisma/client";
import { Request } from "express";
import { fileUploader } from "../../../helpers/fileUploader";
import prisma from "../../../shared/prisma";

const insertIntoDB = async (req: Request) => {
  // service logic here
  const file = req.file;
  if (file) {
    const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
    req.body.icon = uploadToCloudinary?.secure_url;
  }
  const result = await prisma.specialties.create({
    data: req.body,
  });
  return result;
};

export const getAllFromDB = async (): Promise<Specialties[]> => {
  const specialties = await prisma.specialties.findMany();
  return specialties;
};

export const deleteFromDB = async (id: string): Promise<Specialties> => {
  const deletedSpecialty = await prisma.specialties.delete({
    where: { id },
  });
  return deletedSpecialty;
};

export const SpecialtiesService = {
  insertIntoDB,
  getAllFromDB,
  deleteFromDB,
};

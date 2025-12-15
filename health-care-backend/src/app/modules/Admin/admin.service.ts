import { Admin, Prisma, UserStatus } from "@prisma/client";
import calculatePagination from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { adminSearchableFields } from "./admin.constant";

const getAllFromDB = async (params: any, options: any) => {
  const { searchTerm, ...rest } = params;

  const { limit, page, skip } = calculatePagination(options);
  const addCondition: Prisma.AdminWhereInput[] = [];

  if (params.searchTerm) {
    addCondition.push({
      OR: adminSearchableFields.map((field) => ({
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
          equals: rest[key],
        },
      })),
    });
  }

  // Exclude deleted records
  addCondition.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.AdminWhereInput = { AND: addCondition };
  const result = await prisma.admin.findMany({
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
  });
  const total = await prisma.admin.count({
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

const getByIdFromDB = async (id: string): Promise<Admin | null> => {
  console.log(id);
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  data: Partial<Admin>
): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.admin.update({
    where: { id },
    data,
  });
  return result;
};

const deleteFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminExists = await transactionClient.admin.findUnique({
      where: { id },
    });
    if (!adminExists) {
      throw new Error(`Admin with id ${id} not found`);
    }

    const adminDeletedData = await transactionClient.admin.delete({
      where: { id },
    });
    await transactionClient.user.delete({
      where: { email: adminDeletedData.email },
    });

    return adminDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string): Promise<Admin | null> => {
  const result = await prisma.$transaction(async (transactionClient) => {
    const adminExists = await transactionClient.admin.findUnique({
      where: { id, isDeleted: false },
    });
    if (!adminExists) {
      throw new Error(`Admin with id ${id} not found`);
    }

    const adminDeletedData = await transactionClient.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });
    await transactionClient.user.update({
      where: { email: adminDeletedData.email },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

import { Prisma } from "@prisma/client";
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

const getByIdFromDB = async (id: string) => {
  console.log(id);
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};
export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
};

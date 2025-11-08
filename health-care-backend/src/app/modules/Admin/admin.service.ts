import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getAllFromDB = async (params: any) => {

  const { searchTerm, ...rest } = params;

  const addCondition: Prisma.AdminWhereInput[] = [];
  const adminSearchableFields: string[] = ["name", "email"];

  // [
  //       {
  //         name: {
  //           contains: params.searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //       {
  //         email: {
  //           contains: params.searchTerm,
  //           mode: "insensitive",
  //         },
  //       },
  //     ],
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
  });
  return result;
};

export const AdminService = {
  getAllFromDB,
};

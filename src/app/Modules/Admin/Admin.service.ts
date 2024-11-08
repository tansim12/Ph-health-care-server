import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { adminSearchAbleFields } from "./Admin.const";
import { IPaginationOptions } from "../../interface/pagination";
import { IAdminFilterRequest } from "./Admin.interface";

const prisma = new PrismaClient();

const findAllAdminDB = async (
  queryObj: IAdminFilterRequest,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: adminSearchAbleFields.map((field) => ({
        [field]: {
          contains: queryObj.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as never],
        },
      })),
    });
  }
  andCondition.push({
    isDeleted: false,
  });
  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };

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
  const meta = {
    page,
    limit,
    total,
  };
  return {
    meta,
    result,
  };
};

const getSingleAdminDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
  return {
    result,
  };
};
const updateAdminInfoDB = async (id: string, body: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: body,
  });
  return {
    result,
  };
};
const deleteUserAndAdminDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tc) => {
    const deleteAdmin = await tc.admin.delete({
      where: {
        id,
        isDeleted: false,
      },
    });

    await tc.user.delete({
      where: {
        email: deleteAdmin?.email,
      },
    });

    return {
      deleteAdmin,
    };
  });

  return {
    result,
  };
};
const softDeleteUserAndAdminDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tc) => {
    const deleteAdmin = await tc.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await tc.user.update({
      where: {
        email: deleteAdmin?.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return {
      deleteAdmin,
    };
  });

  return {
    result,
  };
};

export const adminService = {
  findAllAdminDB,
  getSingleAdminDB,
  updateAdminInfoDB,
  deleteUserAndAdminDB,
  softDeleteUserAndAdminDB,
};

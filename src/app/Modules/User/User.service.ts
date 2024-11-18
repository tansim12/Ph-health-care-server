import { Prisma, PrismaClient, UserRole, UserStatus } from "@prisma/client";
const prisma = new PrismaClient();
import Bcrypt from "bcrypt";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { userSearchAbleFields } from "./User.const";

const getAllUsersDB = async (queryObj: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: queryObj.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }
  console.log(searchTerm);

  if (Object.keys(filterData).length > 0) {
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.UserWhereInput = { AND: andCondition };

  const result = await prisma.user.findMany({
    where: whereConditions,
    select: {
      email: true,
      createdAt: true,
      id: true,
      needPasswordChange: true,
      status: true,
      isDelete: true,
      role: true,
      updatedAt: true,
    },
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

  const total = await prisma.user.count({
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

const createUserDB = async (body: any) => {
  console.log(body);
  return body;
};
const adminCreateDB = async (body: any) => {
  const hashPass = await Bcrypt.hash(body?.password, 12);
  const userData = {
    password: hashPass,
    email: body?.admin?.email,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const adminCreate = await tnx.admin.create({
      data: body?.admin,
    });

    return {
      adminCreate,
    };
  });
  return result;
};
const createDoctorDB = async (body: any) => {
  const hashPass = await Bcrypt.hash(body?.password, 12);
  const userData = {
    password: hashPass,
    email: body?.doctor?.email,
    role: UserRole.DOCTOR,
  };

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const doctorCreate = await tnx.doctor.create({
      data: body?.doctor,
    });

    return doctorCreate;
  });
  return result;
};
const createPatientDB = async (body: any) => {
  const hashPass = await Bcrypt.hash(body?.password, 12);
  const userData = {
    password: hashPass,
    email: body?.patient?.email,
    role: UserRole.PATIENT,
  };

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: userData,
    });

    const patientCreate = await tnx.patient.create({
      data: body?.patient,
    });

    return patientCreate;
  });
  return result;
};

const adminUpdateUserDB = async (
  tokenId: string,
  userId: string,
  payload: any
) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenId,
      isDelete: false,
      status: UserStatus.ACTIVE,
    },
  });

  const result = await prisma.user.update({
    where: {
      id: userId,
    },
    data: payload,
    select: {
      id: true,
    },
  });

  return result;
};

const findByProfileDB = async (tokenId: string, role: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: tokenId, isDelete: false, status: UserStatus.ACTIVE },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      status: true,
      isDelete: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  let userProfile = {};

  if (role === UserRole.ADMIN || role === UserRole.SUPER_ADMIN) {
    userProfile = await prisma.admin.findUniqueOrThrow({
      where: { email: user.email },
    });
  }

  if (role === UserRole.PATIENT) {
    userProfile = await prisma.patient.findUniqueOrThrow({
      where: { email: user.email },
    });
  }
  if (role === UserRole.DOCTOR) {
    userProfile = await prisma.doctor.findUniqueOrThrow({
      where: { email: user.email },
    });
  }

  return {...userProfile, ...user,  };
};
export const userService = {
  getAllUsersDB,
  createUserDB,
  adminCreateDB,
  createDoctorDB,
  createPatientDB,
  adminUpdateUserDB,
  findByProfileDB,
};

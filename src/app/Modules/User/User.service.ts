import { PrismaClient, UserRole } from "@prisma/client";
const prisma = new PrismaClient();
import Bcrypt from "bcrypt";

const getAllUsersDB = async () => {
  return {
    message: "user service",
  };
};

const createUserDB = async (body: any) => {
  console.log(body);
  return body;
};
const adminCreateDB = async (body: any) => {
  const hashPass = await Bcrypt.hash(body?.password, 12);
  const userData = {
    password:hashPass,
    email: body?.admin?.email,
    role: UserRole.ADMIN,
  };

  console.log({ userData, body });

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
export const userService = {
  getAllUsersDB,
  createUserDB,
  adminCreateDB,
};

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
export const userService = {
  getAllUsersDB,
  createUserDB,
  adminCreateDB,
  createDoctorDB,
  createPatientDB,
};

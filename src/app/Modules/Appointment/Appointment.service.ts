import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import prisma from "../../shared/prisma";
import { v4 as uuidv4 } from "uuid";

const createAppointmentDB = async (tokenEmail: string, payload: any) => {
  const { doctorId, scheduleId } = payload;
  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      email: tokenEmail,
      isDeleted: false,
    },
  });

  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });
  const doctorScheduleInfo = await prisma.doctorSchedules.findUniqueOrThrow({
    where: {
      doctorId_scheduleId: {
        doctorId,
        scheduleId,
      },
      isBooked: false,
    },
  });

  const videoCallId = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const createAppointment = await tx.appointment.create({
      data: {
        patientId: patientInfo?.id,
        doctorId,
        scheduleId,
        videoCallingId: videoCallId,
      },
      include: {
        doctor: true,
        doctorSchedule: true,
        patient: true,
        schedule: true,
      },
    });

    // update doctorSchedule
    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId,
          scheduleId,
        },
        isBooked: false,
      },
      data: {
        isBooked: true,
        appointmentId: createAppointment.id,
      },
    });

    const tnxId = `${uuidv4() + new Date().getMilliseconds()}`;
    // crate payment
    const createPayment = await tx.payment.create({
      data: {
        amount: Math.ceil(doctorInfo.appointmentFee),
        transactionId: tnxId,
        appointmentId: createAppointment.id,
      },
    });
    return createAppointment;
  });
  return result;
};

const findPatientMyAppointmentDB = async (
  queryObj: any,
  options: any,
  tokenEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, dSpecialties, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      doctor: {
        name: {
          contains: queryObj.searchTerm,
          mode: "insensitive",
        },
      },
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition as any };

  const result = await prisma.appointment.findMany({
    where: {
      ...(whereConditions as any),
      patient: {
        email: tokenEmail,
      },
    },
    include: {
      doctor: true,
      doctorSchedule: true,
      patient: true,
      payment: true,
      schedule: true,
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

  const total = await prisma.appointment.count({
    where: {
      ...(whereConditions as any),
      patient: {
        email: tokenEmail,
      },
    },
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
const findDoctorMyAppointmentDB = async (
  queryObj: any,
  options: any,
  tokenEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, dSpecialties, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      patient: {
        name: {
          contains: queryObj.searchTerm,
          mode: "insensitive",
        },
      },
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition as any };

  const result = await prisma.appointment.findMany({
    where: {
      ...(whereConditions as any),
      doctor: {
        email: tokenEmail,
      },
    },
    include: {
      doctor: true,
      doctorSchedule: true,
      patient: {
        include: {
          medicalReport: true,
          patientHealthData: true,
        },
      },
      payment: true,
      schedule: true,
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

  const total = await prisma.appointment.count({
    where: {
      ...(whereConditions as any),
      doctor: {
        email: tokenEmail,
      },
    },
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

export const appointmentService = {
  createAppointmentDB,
  findPatientMyAppointmentDB,
  findDoctorMyAppointmentDB,
};

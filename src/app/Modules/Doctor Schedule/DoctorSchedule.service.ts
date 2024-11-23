import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { paginationHelper } from "../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";

const doctorCreateScheduleDB = async (email: string, payload: any) => {
  const doctorInfo = await prisma.doctor.findUniqueOrThrow({
    where: {
      email,
      isDeleted: false,
    },
  });

  const payloadData = payload?.scheduleIds.map((item: any) => ({
    doctorId: doctorInfo?.id,
    scheduleId: item,
  }));
  const result = prisma.doctorSchedules.createManyAndReturn({
    data: payloadData,
    skipDuplicates: true,
  });

  return result;
};

const findSingleDoctorScheduleDB = async (
  queryObj: any,
  options: IPaginationOptions,
  tokenEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, startDate, endDate, ...filterData } = queryObj;

  const andCondition = [];

  // implement date range filter
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          schedule: {
            startDateTime: {
              gte: startDate,
            },
          },
        },
        {
          schedule: {
            endDateTime: {
              lte: endDate,
            },
          },
        },
      ],
    });
  }
  if (searchTerm) {
    andCondition.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (filterData) {
    }
   if (typeof filterData?.isBooked === "string" && filterData?.isBooked === "false") {
    filterData.isBooked = false
   }
   if (typeof filterData?.isBooked === "string" && filterData?.isBooked === "true") {
    filterData.isBooked = true
   }
    andCondition.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData[key as never],
        },
      })),
    });
  }

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition as any };

  const result = await prisma.doctorSchedules.findMany({
    where: {
      ...(whereConditions as any),
      doctor: {
        email: tokenEmail,
      },
    },
    include: {
      schedule: true,
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {},
  });

  const total = await prisma.doctorSchedules.count({
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

export const doctorScheduleService = {
  doctorCreateScheduleDB,
  findSingleDoctorScheduleDB,
};

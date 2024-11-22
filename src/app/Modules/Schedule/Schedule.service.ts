import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../shared/prisma";
import { IPaginationOptions } from "../../interface/pagination";
import { paginationHelper } from "../../helper/paginationHelper";
import { scheduleSearchAbleFields } from "./Schedule.const";
import { Prisma } from "@prisma/client";
const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const scheduleCreateDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime, timeInterval } = payload;
  const currentStartDate = new Date(startDate);
  const currentEndDate = new Date(endDate);
  const scheduleReturnData = [] as any;
  while (currentStartDate <= currentEndDate) {
    const startDateTime = new Date(
      addMinutes(
        // add hours inside add minutes
        addHours(
          `${format(currentStartDate, "yyyy-MM-dd")}`,
          Number(startTime?.split(":")?.[0])
        ),
        Number(startTime?.split(":")?.[1])
      )
    );
    const endDateTime = new Date(
      addMinutes(
        // add hours inside add minutes
        addHours(
          `${format(currentStartDate, "yyyy-MM-dd")}`,
          Number(endTime?.split(":")?.[0])
        ),
        Number(endTime?.split(":")?.[1])
      )
    );

    console.log({ startDateTime, endDateTime });
    while (startDateTime < endDateTime) {
      // const scheduleData = {
      //     startDateTime: startDateTime,
      //     endDateTime: addMinutes(startDateTime, timeInterval)
      // }

      const s = await convertDateTime(startDateTime);
      const e = await convertDateTime(addMinutes(startDateTime, timeInterval));

      const scheduleData = {
        startDateTime: s,
        endDateTime: e,
      };
      // exist check this schedule exists
      const isExistSchedule = await prisma.schedule.findFirst({
        where: {
          startDateTime: scheduleData.startDateTime,
          endDateTime: scheduleData.endDateTime,
        },
      });

      if (!isExistSchedule) {
        const result = await prisma.schedule.create({
          data: scheduleData,
        });
        scheduleReturnData.push(result as never);
      }
      startDateTime.setMinutes(startDateTime.getMinutes() + timeInterval);
    }
    currentStartDate.setDate(currentStartDate.getDate() + 1);
  }
  return scheduleReturnData;
};

const findAllScheduleDB = async (
  queryObj: any,
  options: IPaginationOptions,
  tokenDoctorEmail: string
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, startDate, endDate, ...filterData } = queryObj;

  const andCondition = [];

  // implement date range filter
  if (startDate && endDate) {
    andCondition.push({
      AND: [
        {
          startDateTime: {
            gte: startDate,
          },
        },
        {
          endDateTime: {
            lte: endDate,
          },
        },
      ],
    });
  }

  if (queryObj.searchTerm) {
    andCondition.push({
      OR: scheduleSearchAbleFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition as any };

  console.log(tokenDoctorEmail);

  // find doctor schedule
  const doctorScheduleData = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: tokenDoctorEmail,
      },
    },
  });

  const doctorAlreadyUseScheduleId = doctorScheduleData.map(
    (item: any) => item?.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...(whereConditions as any),
      id: { notIn: doctorAlreadyUseScheduleId }, // filter doctor schedule remove
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

  const total = await prisma.schedule.count({
    where: whereConditions as never,
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

export const scheduleService = {
  scheduleCreateDB,
  findAllScheduleDB,
};

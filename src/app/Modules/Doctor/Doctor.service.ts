import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helper/paginationHelper";
import { IPaginationOptions } from "../../interface/pagination";
import prisma from "../../shared/prisma";
import { doctorSearchAbleFields } from "./Doctor.const";

const doctorInfoUpdateSpecialtiesCreateAndUpdateDB = async (
  id: string,
  payload: any
) => {
  const { specialties, ...doctorInfo } = payload;
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  // transaction here
  const result = await prisma.$transaction(async (tx) => {
    if (specialties && specialties.length > 0) {
      const createSpecialtiesArray = specialties.filter(
        (item: any) => !item?.isDelete
      );
      const deleteSpecialtiesArray = specialties.filter(
        (item: any) => item?.isDelete
      );

      // create specialties
      if (createSpecialtiesArray && createSpecialtiesArray?.length > 0) {
        for (const specialty of createSpecialtiesArray) {
          await tx.doctorSpecialties.create({
            data: {
              specialitiesId: specialty.specialtiesId,
              doctorId: doctorData.id,
            },
          });
        }
      }
      // delete specialties
      if (deleteSpecialtiesArray && deleteSpecialtiesArray?.length > 0) {
        for (const specialty of deleteSpecialtiesArray) {
          await tx.doctorSpecialties.deleteMany({
            where: {
              specialitiesId: specialty.specialtiesId,
              doctorId: doctorData.id,
            },
          });
        }
      }

      const result = await tx.doctor.update({
        where: {
          id,
        },
        data: doctorInfo,
        include: {
          doctorSpecialties: true,
        },
      });
      return result;
    }
  });
  return result;
};

const findAllDoctorDB = async (queryObj: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = queryObj;

  const andCondition = [];
  if (queryObj.searchTerm) {
    andCondition.push({
      OR: doctorSearchAbleFields.map((field) => ({
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

  const whereConditions: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.doctor.findMany({
    where: whereConditions as never,
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
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

  const total = await prisma.doctor.count({
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

export const doctorService = {
  doctorInfoUpdateSpecialtiesCreateAndUpdateDB,
  findAllDoctorDB,
};

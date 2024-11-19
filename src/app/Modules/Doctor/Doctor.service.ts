import prisma from "../../shared/prisma";

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
        include:{
          doctorSpecialties:true
        }
      });
      return result;
    }
  });
  return result;
};

export const doctorService = {
  doctorInfoUpdateSpecialtiesCreateAndUpdateDB,
};

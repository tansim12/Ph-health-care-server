import prisma from "../../shared/prisma";

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

export const doctorScheduleService = {
  doctorCreateScheduleDB,
};

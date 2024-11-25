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
    return createAppointment;
  });
  return result;
};

export const appointmentService = {
  createAppointmentDB,
};

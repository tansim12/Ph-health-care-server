import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../shared/prisma";
const convertDateTime = async (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() + offset);
};

const scheduleCreateDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime, timeInterval } = payload;
  const currentStartDate = new Date(startDate);
  const currentEndDate = new Date(endDate);
  const scheduleReturnData = [];
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

export const scheduleService = {
  scheduleCreateDB,
};

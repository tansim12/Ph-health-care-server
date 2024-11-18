import { UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";

const createSpecialtiesDB = async (tokenId: string, payload: any) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: tokenId,
      status: UserStatus.ACTIVE,
      isDelete: false,
    },
  });

  const result = await prisma.specialties.create({
    data: payload,
  });
  return result;
};

export const specialtiesService = {
  createSpecialtiesDB,
};

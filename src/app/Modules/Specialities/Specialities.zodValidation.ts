import { z } from "zod";

const createSpecialtiesZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: "String" })
  }),
});

export const specialtiesZodSchemas = {
  createSpecialtiesZodSchema,
};

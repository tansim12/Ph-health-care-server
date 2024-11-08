import { z } from "zod";

const createAdminZodSchema = z.object({
  body: z.object({}),
});

const updateAdminZodSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name should be string" }).optional(),
    contactNumber: z
      .string({ required_error: "ContactNumber should be string" })
      .optional(),
    isDeleted: z
      .boolean({ required_error: "IsDelete should be boolean" })
      .optional(),
  }),
});

export const adminZodValidation = {
  updateAdminZodSchema,
};

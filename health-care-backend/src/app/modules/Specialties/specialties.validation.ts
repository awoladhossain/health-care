import z from "zod";
const create = z.object({
  title: z.string().min(3, "Title is required"),
});

export const specialtiesValidation = {
  create,
};

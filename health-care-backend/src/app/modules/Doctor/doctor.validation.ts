import { z } from "zod";

const create = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  profilePhoto: z.string(),
  contactNumber: z.string().min(10),
  registrationNumber: z.string().min(3),
  experience: z.number(),
  gender: z.string(),
  apointmentFee: z.number(),
  qualification: z.string(),
  designation: z.string(),
  currentworkingplace: z.string(),
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().optional(),
    gender: z.string().optional(),
    apointmentFee: z.number().optional(),
    qualification: z.string().optional(),
    currentworkingplace: z.string().optional(),
    designation: z.string().optional(),
  }),
});

export const DoctorValidation = {
  create,
  update,
};

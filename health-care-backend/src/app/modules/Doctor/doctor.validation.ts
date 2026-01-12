import { z } from "zod";

const create = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
  profilePhoto: z.string(),
  contactNumber: z.string().min(10),
  registrationNumber: z.string().min(3),
  experience: z.number(),
  gender: z.string(),
  appointmentFee: z.number(), // ✅ Fixed spelling
  qualification: z.string(),
  designation: z.string(),
  currentWorkingPlace: z.string(), // ✅ Fixed casing
});

const update = z.object({
  body: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
    registrationNumber: z.string().optional(),
    experience: z.number().optional(),
    gender: z.string().optional(),
    appointmentFee: z.number().optional(), // ✅ Fixed spelling
    qualification: z.string().optional(),
    currentWorkingPlace: z.string().optional(), // ✅ Fixed casing
    designation: z.string().optional(),
  }),
});

export const DoctorValidation = {
  create,
  update,
};

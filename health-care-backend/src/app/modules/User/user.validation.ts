import { Gender } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
  password: z.string().min(6, "Password is required"),
  admin: z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
  }),
});

const createDoctor = z.object({
  password: z.string().min(6, "Password is required"),
  doctor: z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    address: z.string().optional(),
    registrationNumber: z.string().min(3, "Registration number is required"),
    experience: z.number().optional(),
    gender: z.enum([Gender.FEMALE, Gender.MALE]),
    appointmentFee: z.number().min(1, "Appointment fee is required"),
    qualification: z.string().min(1, "Qualification is required"),
    currentWorkingPlace: z.string().min(1, "Current working place is required"),
    designation: z.string().min(1, "Designation is required"),
  }),
});

const createPatient = z.object({
  password: z.string().min(6, "Password is required"),
  patient: z.object({
    name: z.string().min(3, "Name is required"),
    email: z.string().email("Invalid email format").min(1, "Email is required"),
    contactNumber: z.string().min(1, "Contact number is required"),
    address: z.string().min(1, "Address is required"),
  }),
});

export const userValidation = {
  createAdmin,
  createDoctor,
  createPatient,
};

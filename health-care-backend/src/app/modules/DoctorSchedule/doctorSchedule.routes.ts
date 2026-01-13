import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { DoctorScheduleController } from "./doctorSchedule.controller";
import { DoctorScheduleValidation } from "./doctorSchedule.validation";
const router = express.Router();

router.post(
  "/",
  auth(UserRole.DOCTOR),
  validateRequest(DoctorScheduleValidation.create),
  DoctorScheduleController.insertIntoDB
);

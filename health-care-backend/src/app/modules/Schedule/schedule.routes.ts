import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import { ScheduleController } from "./schedule.controllers";

const router = express.Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  ScheduleController.inserIntoDB
);

export const ScheduleRoutes = router;

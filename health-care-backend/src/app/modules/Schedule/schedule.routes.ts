import express from "express";
import { ScheduleController } from "./schedule.controllers";


const router = express.Router();

router.post("/", ScheduleController.inserIntoDB);

export const ScheduleRoutes = router;

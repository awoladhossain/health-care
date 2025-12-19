import { UserRole } from "@prisma/client";
import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AdminController } from "./admin.controller";
import { adminValidationsSchema } from "./admin.validations";
const router = express.Router();

router.get(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getAllFromDB
);
router.get(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.getByIdFromDB
);
router.patch(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  validateRequest(adminValidationsSchema.update),
  AdminController.updateIntoDB
);
router.delete(
  "/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.deleteFromDB
);
router.delete(
  "/soft/:id",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  AdminController.softDeleteFromDB
);

export const adminRoutes = router;

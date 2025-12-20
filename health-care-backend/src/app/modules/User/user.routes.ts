import { UserRole } from "@prisma/client";
import express from "express";
import multer from "multer";
import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  upload.single("file"),
  userController.createAdmin
);

export const userRoutes = router;

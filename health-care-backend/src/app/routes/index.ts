import express from "express";
import { adminRoutes } from "../modules/Admin/admin.routes";
import { userRoutes } from "../modules/User/user.routes";

const router = express.Router();
const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/admins",
    route: adminRoutes,
  },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;

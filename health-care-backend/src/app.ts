import cors from "cors";
import express, { Application, Request, Response } from "express";
import { adminRoutes } from "./app/modules/Admin/admin.routes";
import { userRoutes } from "./app/modules/User/user.routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "The server is started" });
});

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admins", adminRoutes);

export default app;

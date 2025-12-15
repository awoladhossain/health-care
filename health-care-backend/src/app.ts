import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import router from "./app/routes";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({ message: "The server is started" });
});

// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1", router);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("Error caught by middleware:", err);
  if (err instanceof Error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.name || "Internal Server Error",
      error: err.message,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: err,
  });
});

export default app;

import express, { NextFunction, Request, Response } from "express";
import { z, ZodObject } from "zod";
import { AdminController } from "./admin.controller";
const router = express.Router();

const update = z.object({
  body: z.object({
    name: z.string(),
    contactNumber: z.string(),
  }),
});

const validateRequest = (schema: ZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    console.log("checker middleware...", req.body);
    next();
  };
};

router.get("/", AdminController.getAllFromDB);
router.get("/:id", AdminController.getByIdFromDB);
router.patch("/:id", validateRequest(update), AdminController.updateIntoDB);
router.delete("/:id", AdminController.deleteFromDB);
router.delete("/soft/:id", AdminController.softDeleteFromDB);

export const adminRoutes = router;

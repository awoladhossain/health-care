// * all req,res will work here

import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { userService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  // console.log(req.body);
  try {
    const result = await userService.createAdmin(req.body);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      message: "Admin Created Successfully!",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.name || "Failed to create Admin",
        error: err.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to create Admin",
      error: err,
    });
  }
};

export const userController = {
  createAdmin,
};

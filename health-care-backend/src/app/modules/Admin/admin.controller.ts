import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const safeQuery = pick(req.query, [
      "name",
      "email",
      "searchTerm",
      "contactNumber",
    ]);

    const result = await AdminService.getAllFromDB(safeQuery);
    res.status(200).json({
      status: 200,
      message: "Admins Fetched Successfully!",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.name || "Failed to fetch Admins",
        error: err.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch Admins",
      error: err,
    });
  }
};

export const AdminController = {
  getAllFromDB,
};

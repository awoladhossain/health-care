import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constant";
import { AdminService } from "./admin.service";

// const sendResponse = <T>(
//   res: Response,
//   jsonData: {
//     statusCode: number;
//     success: boolean;
//     message: string;
//     meta?: { page: number; limit: number; total: number };
//     data: T | null | undefined;
//   }
// ) => {
//   res.status(jsonData.statusCode).json({
//     success: jsonData.success,
//     message: jsonData.message,
//     meta: jsonData.meta || null || undefined,
//     data: jsonData.data || null || undefined,
//   });
// };

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const safeQuery = pick(req.query, adminFilterAbleFileds);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllFromDB(safeQuery, options);
    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admins Fetched Successfully!",
      meta: result.meta,
      data: result.data,
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
const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await AdminService.getByIdFromDB(id as string);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admins Fetched Successfully By ID!",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.name || "Failed to fetch Admins By ID",
        error: err.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch Admins By ID",
      error: err,
    });
  }
};

const updateIntoDB = async (req: Request, res: Response, next:NextFunction) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }
  try {
    const result = await AdminService.updateIntoDB(id, req.body);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin updated Successfully By ID!",
      data: result,
    });
  } catch (err: unknown) {
    next(err);
  }
};

const deleteFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }
  try {
    const result = await AdminService.deleteFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted Successfully By ID!",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.name || "Failed to fetch Admins By ID",
        error: err.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch Admins By ID",
      error: err,
    });
  }
};

const softDeleteFromDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }
  try {
    const result = await AdminService.softDeleteFromDB(id);

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Admin deleted Successfully By ID!",
      data: result,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err.name || "Failed to fetch Admins By ID",
        error: err.message,
      });
    }

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch Admins By ID",
      error: err,
    });
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

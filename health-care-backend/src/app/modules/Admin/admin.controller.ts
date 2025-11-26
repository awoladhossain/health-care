import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const safeQuery = pick(req.query, adminFilterAbleFileds);
    const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllFromDB(safeQuery, options);
    res.status(200).json({
      status: 200,
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
    res.status(200).json({
      status: 200,
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

const updateIntoDB = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }
  try {
    const result = await AdminService.updateIntoDB(id, req.body);
    res.status(200).json({
      status: 200,
      message: "Admin updated Successfully By ID!",
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
    res.status(200).json({
      status: 200,
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
    res.status(200).json({
      status: 200,
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

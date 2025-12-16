import { RequestHandler } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
import { adminFilterAbleFileds } from "./admin.constant";
import { AdminService } from "./admin.service";

const getAllFromDB: RequestHandler = catchAsync(async (req, res) => {
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
});

const getByIdFromDB: RequestHandler = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AdminService.getByIdFromDB(id as string);

  if (!result) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ success: false, message: "Admin not found with the given ID" });
  }
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admins Fetched Successfully By ID!",
    data: result,
  });
});

const updateIntoDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }

  const result = await AdminService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin updated Successfully By ID!",
    data: result,
  });
});

const deleteFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }
  const result = await AdminService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted Successfully By ID!",
    data: result,
  });
});

const softDeleteFromDB: RequestHandler = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: "ID parameter is required",
    });
  }

  const result = await AdminService.softDeleteFromDB(id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin deleted Successfully By ID!",
    data: result,
  });
});

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDeleteFromDB,
};

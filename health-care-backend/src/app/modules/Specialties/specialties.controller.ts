import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendResponse } from "../../../helpers/sendResponseHelper";
import catchAsync from "../../../shared/catchAsync";
import { SpecialtiesService } from "./specialties.service";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
  // controller logic here
  console.log(req.body);
  const result = await SpecialtiesService.insertIntoDB(req);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Admin created Successfully!",
    data: result,
  });
});

export const SpecialtiesController = {
  insertIntoDB,
};

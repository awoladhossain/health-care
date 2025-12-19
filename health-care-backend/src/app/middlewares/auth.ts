import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import ApiError from "../errors/ApiError";
const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new ApiError(
          401,
          "You are not authorized to access this resource"
        );
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.jwt.jwt_secret as string
      );
      req.user = verifiedUser;
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(
          403,
          "You do not have permission to access this resource"
        );
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

import { NextFunction, Request, Response } from "express";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("No token provided");
      }
      const verifiedUser = jwtHelpers.verifyToken(
        token as string,
        config.jwt.jwt_secret as string
      );
      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new Error("You do not have permission to access this resource");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;

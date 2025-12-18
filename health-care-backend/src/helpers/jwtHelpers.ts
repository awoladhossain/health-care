import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken";

interface IJwtPayload {
  email: string;
  role: string;
}

const generateToken = (
  payload: IJwtPayload,
  secretKey: string,
  expiresIn: SignOptions["expiresIn"]
): string => {
  return jwt.sign(
    payload,
    secretKey as Secret,
    {
      algorithm: "HS256",
      expiresIn,
    } as SignOptions
  );
};

const verifyToken = (token: string, secretKey: Secret) => {
  return jwt.verify(token, secretKey) as JwtPayload;
};
export const jwtHelpers = {
  generateToken,
  verifyToken,
};

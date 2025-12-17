import jwt, { SignOptions } from "jsonwebtoken";

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
    secretKey as jwt.Secret,
    {
      algorithm: "HS256",
      expiresIn,
    } as SignOptions
  );
};

export default generateToken;

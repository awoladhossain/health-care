import dotenv from "dotenv";
import path from "path";
const envPath = path.join(process.cwd(), ".env");
console.log("Loading .env from:", envPath);

dotenv.config({
  path: envPath,
});
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiresIn: process.env.JWT_EXPIRES_IN,
    refresh_token_secret: process.env.REFRESH_TOKEN_SECRET,
    refresh_token_expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
    reset_password_token_secret: process.env.RESET_PASSWORD_TOKEN_SECRET,
    reset_password_token_expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRES_IN,
  },
  reset_password_link: process.env.RESET_PASSWORD_LINK,
  emailSender: {
    email: process.env.EMAIL,
    APP_PASSWOED: process.env.APP_PASSWOED,
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  },
};

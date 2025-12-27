import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import multer from "multer";
import path from "path";
import { ICloudinaryResponse, IFile } from "../app/interfaces/file";
import config from "../config";

// Validate configuration before using
if (!config.cloudinary.cloud_name || !config.cloudinary.api_key || !config.cloudinary.api_secret) {
  throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
}
 
cloudinary.config({
  cloud_name: config.cloudinary.cloud_name!,
  api_key: config.cloudinary.api_key!,
  api_secret: config.cloudinary.api_secret!,
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

const uploadToCloudinary = async (
  file: IFile
): Promise<ICloudinaryResponse | undefined> => {
  return new Promise((reslove, reject) => {
    cloudinary.uploader.upload(
      file.path,
      (error: Error, result: ICloudinaryResponse) => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
        if (error) {
          reject(error);
        } else {
          reslove(result);
        }
      }
    );
  });
};

export const fileUploader = {
  upload,
  uploadToCloudinary,
};

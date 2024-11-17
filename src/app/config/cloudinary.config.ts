import { v2 as cloudinary } from 'multer-storage-cloudinary';
import config from '.';


cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

export const cloudinaryUpload = cloudinary;
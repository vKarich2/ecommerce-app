import cloudinaryPackage from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
import { CloudinaryStorage } from "multer-storage-cloudinary";

dotenv.config();

const cloudinary = cloudinaryPackage.v2;

// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// create storage engine for multer
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpeg", "jpg", "png"],
  params: {
    folder: "Ecommerce-api",
  },
});

// init multer with storage engine
const categoryUpload = multer({
  storage: storage,
});

export default categoryUpload;

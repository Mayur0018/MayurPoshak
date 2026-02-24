import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: (process.env.CLOUDINARY_CLOUD_NAME as string) || (process.env.CLOUDINARY_NAME as string),
  api_key: process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string,
  secure: true,
});

export { cloudinary };

export function transformUrl(secureUrl: string, transform: string) {
  // Insert transformation after /upload/
  return secureUrl.replace("/upload/", `/upload/${transform}/`);
}


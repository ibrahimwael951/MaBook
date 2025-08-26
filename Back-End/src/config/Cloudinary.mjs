import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import "dotenv/config";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadBuffer = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

export const deleteImage = (publicId, options = { resource_type: "image" }) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, options, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};

export const replaceImageOverwrite = (
  buffer,
  publicId = undefined,
  options = {}
) => {
  const uploadOptions = {
    ...options,
    resource_type: "image",
    overwrite: true,
    invalidate: true,
  };
  if (publicId) uploadOptions.public_id = publicId;

  return uploadBuffer(buffer, uploadOptions);
};

export const getPublicIdFromUrl = (url) => {
  try {
    const u = new URL(url);
    // path like /demo/image/upload/v12345/folder/.../name.ext
    const parts = u.pathname.split("/");
    // find index of "upload"
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) return null;
    // everything after upload/version (v123...) is the public id + ext
    let afterUpload = parts.slice(uploadIdx + 1);
    // if first segment after upload is a version like "v123456", drop it
    if (afterUpload[0] && afterUpload[0].startsWith("v"))
      afterUpload = afterUpload.slice(1);
    const last = afterUpload.join("/"); // e.g. folder/name.jpg
    // drop extension
    return last.replace(/\.[^/.]+$/, "");
  } catch (e) {
    return null;
  }
};

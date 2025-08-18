import multer from "multer";
import cloudinary from "./Cloudinary.mjs";
import streamifier from "streamifier";

const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (/^image\/(jpe?g|png|webp|gif)$/i.test(file.mimetype))
      return cb(null, true);
    cb(new Error("Only image files are allowed"));
  },
});

export const uploadBufferToCloudinary = (
  buffer,
  options = { folder: "posts" }
) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

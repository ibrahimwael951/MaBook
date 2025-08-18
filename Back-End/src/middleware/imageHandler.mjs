import { uploadBuffer } from '../config/Cloudinary.mjs';

export const handleImageUpload = async (file) => {
  if (!file || !file.buffer) return null;
  
  try {
    const result = await uploadBuffer(file.buffer, {
      folder: "myapp/posts",
      resource_type: "auto",
    });

    return {
      url: result.secure_url || result.url,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      format: result.format,
      resource_type: result.resource_type,
    };
  } catch (error) {
    console.error("Image upload failed:", error);
    throw new Error("Failed to upload image");
  }
};
import {
  deleteImage,
  getPublicIdFromUrl,
  replaceImageOverwrite,
  uploadBuffer,
} from "../config/Cloudinary.mjs";

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

export const handleImageRemove = async ({
  publicId,
  url,
  options = { resource_type: "image" },
} = {}) => {
  if (!publicId && !url)
    throw new Error("publicId or url is required to delete image");

  if (!publicId && url && typeof getPublicIdFromUrl === "function") {
    publicId = getPublicIdFromUrl(url);
  }

  if (!publicId) throw new Error("Could not determine public_id from url");

  try {
    const result = await deleteImage(publicId, options);
    return result;
  } catch (error) {
    console.error("Image delete failed:", error);
    throw new Error("Failed to delete image");
  }
};

export const handleImageReplace = async ({
  file,
  publicId,
  url,
  method = "overwrite",
  options = {},
} = {}) => {
  if (!file || !file.buffer)
    throw new Error("file with buffer is required to replace image");

  if (!publicId && url && typeof getPublicIdFromUrl === "function") {
    publicId = getPublicIdFromUrl(url);
  }

  try {
    let uploadResult;

    if (publicId) {
      if (method === "deleteThenUpload") {
        uploadResult = await replaceImageDeleteThenUpload(
          file.buffer,
          publicId,
          {
            resource_type: "auto",
            invalidate: true,
            folder: "myapp/posts",
            ...options,
          }
        );
      } else {
        uploadResult = await replaceImageOverwrite(file.buffer, publicId, {
          resource_type: "auto",
          overwrite: true,
          invalidate: true,
          folder: "myapp/posts",
          ...options,
        });
      }
    } else {
      uploadResult = await uploadBuffer(file.buffer, {
        resource_type: "auto",
        folder: "myapp/posts",
        ...options,
      });
    }

    return _normalizeUploadResult(uploadResult);
  } catch (error) {
    console.error("Image replace failed:", error);
    throw new Error("Failed to replace image");
  }
};

const _normalizeUploadResult = (result = {}) => {
  return {
    url: result.secure_url || result.url || null,
    public_id: result.public_id || null,
    width: result.width || null,
    height: result.height || null,
    bytes: result.bytes || null,
    format: result.format || null,
    resource_type: result.resource_type || null,
    raw: result,
  };
};

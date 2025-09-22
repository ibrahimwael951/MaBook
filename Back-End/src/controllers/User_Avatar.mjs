import { user } from "../mongoose/schema/UserAuth.mjs";
import {
  handleImageRemove,
  handleImageReplace,
  handleImageUpload,
} from "../middleware/imageHandler.mjs";

export const UpdateUserAvatar = async (_id, file) => {
  if (!_id) {
    const err = new Error("Missing user id");
    err.status = 400;
    throw err;
  }

  if (!file) {
    const err = new Error("No file provided");
    err.status = 400;
    throw err;
  }

  let imageUrl;
  try {
    const result = await handleImageUpload(file);

    imageUrl = typeof result === "string" ? result : result?.url;
  } catch (uploadErr) {
    const err = new Error(
      `Image upload failed: ${uploadErr?.message || uploadErr}`
    );
    err.status = 500;
    throw err;
  }

  if (!imageUrl) {
    const err = new Error("Image upload did not return a valid URL");
    err.status = 500;
    throw err;
  }

  const updated = await user
    .findOneAndUpdate({ _id }, { $set: { avatar: imageUrl } }, { new: true })
    .lean();

  if (!updated) {
    const err = new Error("User not found");
    err.status = 404;
    throw err;
  }

  delete updated.password;
  delete updated.__v;

  return updated;
};

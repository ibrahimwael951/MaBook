import { Posts } from "../mongoose/schema/Posts.mjs";
import {
  handleImageRemove,
  handleImageReplace,
  handleImageUpload,
} from "../middleware/imageHandler.mjs";

export const createPost = async (userData, postData, file) => {
  const hasText = postData.description?.trim().length > 0;
  if (!hasText || !file) {
    throw new Error("Post requires text and image");
  }

  const image = file ? await handleImageUpload(file) : null;

  const newPost = new Posts({
    author: userData.username,
    ...postData,
    image,
  });

  return await newPost.save();
};

export const updatePost = async (
  postId,
  userData,
  postData = {},
  file = null
) => {
  const post = await Posts.findById(postId);
  if (!post) throw new Error("Post not found");

  if (post.author !== userData.username) {
    throw new Error("Not authorized to edit this post");
  }

  try {
    if (file && file.buffer) {
      const existingPublicId = post.image?.public_id || null;

      if (existingPublicId) {
        try {
          await handleImageRemove({
            publicId: existingPublicId,
            url: post.image?.url,
          });
        } catch (removeErr) {
          console.error("Failed to remove previous image:", removeErr);
        }
      }

      const uploaded = await handleImageReplace({
        file,
        options: { folder: "myapp/posts" },
      });

      post.image = uploaded;
    } else if (postData.removeImage) {
      if (post.image) {
        try {
          await handleImageRemove({
            publicId: post.image.public_id,
            url: post.image.url,
          });
        } catch (removeErr) {
          console.error("Failed to remove image on request:", removeErr);
        }
      }
      post.image = null;
    }

    const updatable = ["description", "title", "tags", "visibility"];
    updatable.forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(postData, key)) {
        post[key] = postData[key];
      }
    });

    const updated = await post.save();
    return updated;
  } catch (err) {
    console.error("Failed to update post:", err);
    throw new Error("Failed to update post");
  }
};

export const deletePost = async (postId, userData) => {
  const post = await Posts.findById(postId);
  if (!post) throw new Error("Post not found");
  if (post.author !== userData.username)
    throw new Error("Not authorized to delete this post");

  try {
    if (post.image) {
      try {
        await handleImageRemove({
          publicId: post.image.public_id,
          url: post.image.url,
        });
      } catch (remErr) {
        console.warn("Failed to remove image from Cloudinary:", remErr);
      }
    }

    const res = await Posts.findByIdAndDelete(postId);
    return res;
  } catch (err) {
    console.error("Failed to delete post:", err);
    throw new Error("Failed to delete post");
  }
};

import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";
import { handleImageUpload } from "../middleware/imageHandler.mjs";

export const createPost = async (userData, postData, file) => {
 
  const hasText = postData.description?.trim().length > 0;
  if (!hasText && !file) {
    throw new Error("Post requires text or image");
  }

 
  const image = file ? await handleImageUpload(file) : null;

 
  const newPost = new UsersPosts({
    author: userData.username,
    ...postData,
    image,
  });

  return await newPost.save();
};

 

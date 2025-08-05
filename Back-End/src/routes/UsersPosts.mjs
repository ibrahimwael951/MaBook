import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";
import { PostSchema } from "../util/ValidationSchema.mjs";
import upload from "../middleware/multer.mjs";
import cloudinary from "../util/Cloudinary.mjs";
const router = Router();

router.post(
  "/api/post",
 
  upload.single("image"),
  checkSchema(PostSchema),
  async (req, res) => {
    // const { findUserName } = req;
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(400).send(result.array());

    const postData = matchedData(req);

    let imageUrl = null;

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ resource_type: "image" }, (err, result) => {
              if (err) reject(err);
              else resolve(result);
            })
            .end(req.file.buffer);
        });

        imageUrl = uploadResult.secure_url;
        
      } catch (err) {
        return res
          .status(500)
          .send({ error: "Image upload failed", details: err });
      }
    }

    const fullPostData = new UsersPosts({
      author: "apolo",
      ...postData,
      image: imageUrl,
    });
    try {
      const SavePost = await fullPostData.save();
      return res.status(200).send(SavePost);
    } catch (err) {
      res.status(400).send(`Error : ${err}`);
    }
  }
);

export default router;

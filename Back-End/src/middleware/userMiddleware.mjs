import { user } from "../mongoose/schema/UserAuth.mjs";
import { Posts } from "../mongoose/schema/Posts.mjs";

export const getUserByUsername = async (req, res, next) => {
  const {
    params: { username },
  } = req;
  const findUser = await user.findOne({ username });
  if (!findUser) return res.status(404).send({ msg: "User Not Found" });
  const SaveUserData = findUser.toObject();
  delete SaveUserData.password;
  delete SaveUserData.email;
  delete SaveUserData.__v;
  delete SaveUserData._id;
  req.findUser = SaveUserData;
  next();
};

export const findPostIdAndAuthor = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const findPostById = await Posts.findById(id);
if(!findPostById){
  return res.status(404).json({message:"no post found "})
}
    const SaveData = findPostById.toObject();
    delete SaveData.__v;

    req.findPostIdAndAuthor = SaveData;
    next();
  } catch (err) {
    return res.status(400).send(`Error : ${err}`);
  }
};

export const CheckUser = async (req, res, next) => {
  try {
    const userUsername = req.user.username;
    const userId = req.user._id;

    const findUser = await user.findOne({ username: userUsername });
    if (!findUser) {
      return res.status(404).json({
        message: "User not Found !!",
      });
    }

    if (findUser._id.toString() !== userId) {
      console.log(userId);
      console.log(findUser._id.toString());
      return res.status(403).json({
        message: "Unauthorized: User mismatch",
      });
    }
    next();
  } catch (err) {
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

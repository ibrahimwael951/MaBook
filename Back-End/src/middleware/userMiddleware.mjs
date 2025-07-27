import { user } from "../mongoose/schema/UserAuth.mjs";
import { UsersPosts } from "../mongoose/schema/UsersPosts.mjs";

export const resolveUsersById = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const findUser = await user.findById(id);
  if (!findUser) res.status(404).send({ msg: "User Not Found" });
  req.findUser = findUser;
  next();
};

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

export const resolveUserLoggedIn = (req, res, next) => {
  const findUserId = req.user.id;
  if (!findUserId) res.status(404).send({ msg: "User Not Found" });
  req.findUserId = findUserId;
  next();
};
export const SaveUserData = async (req, res, next) => {
  const UserLogged = req.user._id;
  if (!UserLogged) res.status(404).send({ msg: "User Not Found" });
  const findUser = await user.findById(UserLogged);
  const SaveUserData = findUser.toObject();
  delete SaveUserData.password;
  req.SaveUserData = SaveUserData;
  next();
};
export const findUserName = async (req, res, next) => {
  const userUsername = req.user.username;
  if (!userUsername)
    return res.status(404).send({ mgs: "You must be logged in " });
  const findUserName = await user.findOne({ username: userUsername });
  if (!findUserName) return res.status(404).send({ mgs: "user not found" });

  req.findUserName = findUserName.toObject().username;
  next();
};

export const findPostIdAndAuthor = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  try {
    const findPostById = await UsersPosts.findById(id);

    const SaveData = findPostById.toObject();
    delete SaveData.__v;

    req.findPostIdAndAuthor = SaveData;
    next();
  } catch (err) {
    return res.status(400).send(`Error : ${err}`);
  }
};

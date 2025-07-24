import { user } from "../mongoose/schema/UserAuth.mjs";

export const resolveUsersById = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  const findUser = await user.findById(id);
  if (!findUser) res.status(404).send({ msg: "User Not Found" });
  req.findUser = findUser;
  next();
};

export const resolveUserLoggedIn = (req, res, next) => {
  const findUserId = req.user.id;
  if (!findUserId) res.status(404).send({ msg: "User Not Found" });
  req.findUserId = findUserId;
  next();
};

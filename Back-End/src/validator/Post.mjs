export const PostSchema = {
  description: {
    in: ["body"],
    optional: true,
    isString: { errorMessage: "description must be a string" },
    trim: true,
    isLength: {
      options: { max: 2000 },
      errorMessage: "description too long (max 2000 chars)",
    },
  },
};
export const PostComment = {
  text: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: {
        min: 2,
      },
      errorMessage: "should be at least 2 characters",
    },
  },
};
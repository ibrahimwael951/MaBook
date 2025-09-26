export const RePostsValidation = {
  postId: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isMongoId: {
      errorMessage: "Target ID must be a valid MongoDB ObjectId",
    },
  },
  text: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: { min: 3, max: 200 },
      errorMessage: "Reason must be between 3 and 200 characters",
    },
  },
  feelings: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: { min: 3, max: 60 },
      errorMessage: "Reason must be between 3 and 60 characters",
    },
  },
};
export const UpdateRePostsValidation = {
  text: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: { min: 3, max: 200 },
      errorMessage: "Reason must be between 3 and 200 characters",
    },
  },
  feelings: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: { min: 3, max: 60 },
      errorMessage: "Reason must be between 3 and 60 characters",
    },
  },
};

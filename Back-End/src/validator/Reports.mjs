export const ReportsValidation = {
  type: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isIn: {
      options: [["post", "comment", "book", "user"]],
      errorMessage: "must be one of post, comment, book, user",
    },
  },
  targetId: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isMongoId: {
      errorMessage: "Target ID must be a valid MongoDB ObjectId",
    },
  },
  reason: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: { min: 3, max: 200 },
      errorMessage: "Reason must be between 3 and 200 characters",
    },
  },
};

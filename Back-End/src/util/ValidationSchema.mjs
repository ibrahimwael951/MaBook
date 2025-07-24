export const UserDataSchema = {
  username: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: {
        min: 2,
        max: 8,
      },
      errorMessage: "should at least 2-8 characters",
    },
  },
  email: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isEmail: {
      errorMessage: "must be a valid email address",
    },
    isLength: {
      options: {
        max: 100,
      },
      errorMessage: "should not exceed 100 characters",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: {
        min: 8,
      },
      errorMessage: "should at least 8 characters",
    },
  },
};
 
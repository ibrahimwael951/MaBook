export const UserLoggingIn = {
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
  firstName: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
 
    isLength: {
      options: {
        min: 2,
        max: 20,
      },
      errorMessage: "should be at least 2 characters",
    },
  },
  lastName: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
 
    isLength: {
      options: {
        min: 2,
        max: 20,
      },
      errorMessage: "should be at least 2 characters",
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
  gender: {
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isIn: {
      options: [["male", "female"]],
      errorMessage: "must be one of 'male', 'female'",
    },
  },
};

export const UpDateUserData = {
  username: {
    optional: true,
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
  bio: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: {
        min: 5,
      },
      errorMessage: "should at least 5 characters",
    },
  },
  gender: {
    optional: true,
    notEmpty: {
      errorMessage: "should not be empty",
    },
    isString: {
      errorMessage: "must be string",
    },
    isIn: {
      options: [["male", "female"]],
      errorMessage: "must be one of 'male', 'female'",
    },
  },
};

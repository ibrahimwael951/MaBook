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
      errorMessage: "should be not exceed 100 characters",
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
      errorMessage: "should be at least 8 characters",
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
  bio: {
    optional: true,
    isString: {
      errorMessage: "must be string",
    },
    isLength: {
      options: {
        min: 5,
      },
      errorMessage: "should be at least 5 characters",
    },
  },
  firstName: {
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
        max: 20,
      },
      errorMessage: "should be at least 2 characters",
    },
  },
  lastName: {
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
        max: 20,
      },
      errorMessage: "should be at least 2 characters",
    },
  },
};

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

export const CheckUsername = {
  username: {
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
export const CheckEmail = {
  email: {
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

export const MyBookSchema = {
  book: {
    BookLink: { type: String, required: true },
    url: { type: String },
    title: { type: String, required: true },
    totalPages: { required: true },
  },
  progress: {
    required: true,
    percentage: {
      isLength: {
        options: {
          min: 0,
          max: 100,
        },
      },
    },
    currentPage: { required: true },
  },
  rate: {
    mood: { type: String, required: true },
    comment: { type: String, required: true },
  },
};

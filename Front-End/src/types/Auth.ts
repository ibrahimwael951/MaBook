export interface User {
  _id: string;
  email: string;
  username: string;
  bio: string;
  fullName: string;
  lastName: string;
  firstName: string;
  avatar?: string;
  followers: number;
  following: number;
  posts: number;
  gender: string;
  createdAt: string;
}
export interface UserProfile {
  username: string;
  avatar?: string;
  bio: string;
  fullName: string;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: string;
  followers: number;
  following: number;
  posts: number;
}
export interface MyBooks {
  _id: string;
  userId: string;
  book: {
    BookLink: string;
    url: string;
    title: string;
    totalPages: string;
  };
  progress: {
    percentage: number;
    currentPage: number;
    lastUpdated: number;
  };
  rate: {
    comment?: string;
    mood?: string;
  };
  createdAt: string;
}
export interface Post {
  _id: string;
  author: {
    username: string;
    fullName: string;
    avatar: string;
    gender: string;
  };
  Liked: boolean;
  description: string;
  createdAt: string;
  commentsCount: number;
  LikesCount: number;
  image: image;
}
export interface Comments {
  _id: string;
  author: string;
  text: string;
  postId: string;
  createdAt: string;
}
export interface image {
  url: string;
  public_id: string;
  width: number;
  height: number;
  resource_type: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface RegisterCredentials {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  password: string;
}
export interface Update {
  bio: string;
  lastName: string;
  firstName: string;
  avatar?: string;
}
export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  updateUser: (User: Update) => Promise<User>;
  refreshUser: () => Promise<void>;
  checkUsername: (username: string) => Promise<true>;
  GetUser: (username: string) => Promise<UserProfile>;
  CheckEmail: (email: string) => Promise<true>;
  GetUserPosts: (email: string) => Promise<Post[]>;
}

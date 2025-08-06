export interface User {
  _id: string;
  email: string;
  username: string;
  bio: string;
  fullName: string;
  lastName: string;
  firstName: string;
  avatar?: string;
  gender: string;
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

export interface LoginCredentials {
  usernameOrEmail: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  refreshUser: () => Promise<void>;
  checkUsername: (username: string) => Promise<true>;
  CheckEmail: (email: string) => Promise<true>;
}

import { requests } from "../../config/agent";
import { User } from "../../lib/types/entities";

export type Register = {
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  role?: string;
  schoolDomain: string;
};

export type RegisterResponse = {
  user: User;
  backendToken?: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export type Login = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  backendToken: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export type JWT = {
  user: {
    id: number;
    email: string;
    name: string;
  };

  backendToken: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export type Session = {
  user: User;
  backendToken: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
};

export const authentication = {
  register: (body: Register) => requests.post<User>("/auth/register", body),
  login: (body: Login) => requests.post<LoginResponse>("/auth/login", body),
  refreshToken: (token: JWT) => requests.post<JWT>("/auth/refresh", token),
  getSchoolList: () => requests.get<any>("/school/list"),
};

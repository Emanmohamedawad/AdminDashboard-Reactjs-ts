import { api } from "./api";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
  UsersQueryParams,
  PaginatedResponse,
  UpdateUserData,
  UpdateProfileData,
} from "../types/index";

// Auth API functions
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post("/auth/register", credentials);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get("/auth/profile");
    return response.data.data;
  },
};

// Users API functions
export const usersAPI = {
  getUsers: async (
    params?: UsersQueryParams,
  ): Promise<PaginatedResponse<User>> => {
    const response = await api.get("/users", { params });
    return response.data;
  },

  getUser: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data.data;
  },

  updateUser: async (id: string, data: UpdateUserData): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },
};

// Profile API functions
export const profileAPI = {
  getProfile: async (): Promise<User> => {
    const response = await api.get("/profile");
    return response.data.data;
  },

  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put("/profile", data);
    return response.data.data;
  },
};

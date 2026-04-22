import { describe, it, expect } from "vitest";
import authReducer, {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  clearError,
} from "./authSlice";
import type { AuthState, User } from "../../types/index";

describe("authSlice", () => {
  const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
  };

  const mockUser: User = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("should return initial state", () => {
    expect(authReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  describe("loginStart", () => {
    it("should set loading to true and clear error", () => {
      const previousState: AuthState = {
        user: null,
        token: null,
        loading: false,
        error: "Previous error",
      };

      const newState = authReducer(previousState, loginStart());

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
    });
  });

  describe("loginSuccess", () => {
    it("should set user and token, clear loading and error", () => {
      const previousState: AuthState = initialState;
      const payload = {
        user: mockUser,
        token: "test-jwt-token",
      };

      const newState = authReducer(previousState, loginSuccess(payload));

      expect(newState.loading).toBe(false);
      expect(newState.error).toBeNull();
      expect(newState.user).toEqual(mockUser);
      expect(newState.token).toBe("test-jwt-token");
    });

    it("should persist token and user to localStorage", () => {
      localStorage.clear();
      const payload = {
        user: mockUser,
        token: "test-jwt-token",
      };

      authReducer(initialState, loginSuccess(payload));

      expect(localStorage.getItem("token")).toBe("test-jwt-token");
      expect(localStorage.getItem("user")).toBe(JSON.stringify(mockUser));
    });
  });

  describe("loginFailure", () => {
    it("should set error message and clear loading", () => {
      const previousState: AuthState = {
        ...initialState,
        loading: true,
      };
      const errorMessage = "Invalid credentials";

      const newState = authReducer(previousState, loginFailure(errorMessage));

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe(errorMessage);
      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
    });
  });

  describe("logout", () => {
    it("should clear user, token, and localStorage", () => {
      localStorage.setItem("token", "test-token");
      localStorage.setItem("user", JSON.stringify(mockUser));

      const previousState: AuthState = {
        user: mockUser,
        token: "test-token",
        loading: false,
        error: null,
      };

      const newState = authReducer(previousState, logout());

      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
      expect(localStorage.getItem("user")).toBeNull();
    });
  });

  describe("clearError", () => {
    it("should clear error message", () => {
      const previousState: AuthState = {
        ...initialState,
        error: "Some error message",
      };

      const newState = authReducer(previousState, clearError());

      expect(newState.error).toBeNull();
      expect(newState.user).toBeNull();
      expect(newState.token).toBeNull();
      expect(newState.loading).toBe(false);
    });
  });
});

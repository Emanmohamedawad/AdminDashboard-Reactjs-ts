import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import ProtectedRoute from "./ProtectedRoute";
import type { AuthState, User } from "../../types/index";

function renderWithRedux(
  component: React.ReactElement,
  {
    preloadedState = {},
  }: { preloadedState?: { auth?: Partial<AuthState> } } = {},
) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        ...preloadedState.auth,
      },
    },
  });

  return {
    ...render(
      <Provider store={store}>
        <BrowserRouter>{component}</BrowserRouter>
      </Provider>,
    ),
    store,
  };
}

describe("ProtectedRoute Component", () => {
  const mockUser: User = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  const mockAdmin: User = {
    id: "2",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  };

  it("should redirect to login when no token is present", () => {
    renderWithRedux(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<div>Login Page</div>} />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: null,
            token: null,
            loading: false,
            error: null,
          },
        },
      },
    );

    expect(screen.getByText("Login Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("should render children when user is authenticated", () => {
    renderWithRedux(
      <Routes>
        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            token: "test-token",
            loading: false,
            error: null,
          },
        },
      },
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to dashboard when non-admin accesses admin route", () => {
    renderWithRedux(
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
            token: "test-token",
            loading: false,
            error: null,
          },
        },
      },
    );

    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
  });

  it("should allow admin to access admin routes", () => {
    renderWithRedux(
      <Routes>
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: mockAdmin,
            token: "test-token",
            loading: false,
            error: null,
          },
        },
      },
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });

  it("should allow admin to access user routes", () => {
    renderWithRedux(
      <Routes>
        <Route
          path="/user-page"
          element={
            <ProtectedRoute requiredRole="user">
              <div>User Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
      {
        preloadedState: {
          auth: {
            user: mockAdmin,
            token: "test-token",
            loading: false,
            error: null,
          },
        },
      },
    );

    expect(screen.getByText("User Content")).toBeInTheDocument();
  });
});

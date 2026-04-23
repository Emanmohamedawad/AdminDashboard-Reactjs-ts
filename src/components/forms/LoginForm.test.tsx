import { describe, it, expect, beforeEach } from "vitest";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../../features/auth/authSlice";
import LoginForm from "./LoginForm";
import type { AuthState } from "../../types/index";

// Helper to render with Redux and Router
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

describe("LoginForm Component", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  it("should render login form with email and password inputs", () => {
    renderWithRedux(<LoginForm />);

    expect(screen.getByText(/sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email address/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i }),
    ).toBeInTheDocument();
  });

  it("should show validation errors for invalid email", async () => {
    const user = userEvent.setup();
    renderWithRedux(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/email address/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });

  it("should show validation error for short password", async () => {
    const user = userEvent.setup();
    renderWithRedux(<LoginForm />);

    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole("button", { name: /sign in/i });

    await user.type(passwordInput, "123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/password must be at least 6 characters/i),
      ).toBeInTheDocument();
    });
  });

  it("should have signup link", () => {
    renderWithRedux(<LoginForm />);

    const signupLink = screen.getByRole("link", {
      name: /don't have an account\? sign up/i,
    });
    expect(signupLink).toBeInTheDocument();
    expect(signupLink).toHaveAttribute("href", "/register");
  });

  it("should disable submit button when loading", () => {
    renderWithRedux(<LoginForm />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: true,
          error: null,
        },
      },
    });

    const submitButton = screen.getByRole("button", {
      name: /signing in/i,
    });
    expect(submitButton).toBeDisabled();
  });

  it("should display error message when present", () => {
    renderWithRedux(<LoginForm />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: "Invalid credentials",
        },
      },
    });

    expect(screen.getByText("Invalid credentials")).toBeInTheDocument();
  });

  it("should allow clearing error message", async () => {
    const user = userEvent.setup();
    renderWithRedux(<LoginForm />, {
      preloadedState: {
        auth: {
          user: null,
          token: null,
          loading: false,
          error: "Invalid credentials",
        },
      },
    });

    const dismissButton = screen.getByRole("button", { name: /dismiss/i });
    expect(dismissButton).toBeInTheDocument();

    await user.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
    });
  });
});

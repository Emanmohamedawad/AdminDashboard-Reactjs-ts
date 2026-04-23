import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import type { RegisterFormData } from "../../types/index";
import {
  registerStart,
  registerSuccess,
  registerFailure,
  clearError,
} from "../../features/auth/authSlice";
import { authAPI } from "../../services/authAPI";

const registerSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .min(6, "Password confirmation is required")
    .required("Please confirm your password")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

const initialValues: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const RegisterForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = async (
    values: RegisterFormData,
    { setSubmitting }: FormikHelpers<RegisterFormData>,
  ) => {
    try {
      dispatch(registerStart());
      const { confirmPassword, ...registerData } = values;
      const response = await authAPI.register(registerData);
      dispatch(registerSuccess(response));
      navigate("/dashboard");
    } catch (error: any) {
      // Don't let the error propagate to prevent page reload
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      dispatch(registerFailure(errorMessage));
    } finally {
      setSubmitting(false);
    }
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn"
      style={{
        background:
          "linear-gradient(135deg, var(--main-bg) 0%, var(--hover-bg) 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 80%, var(--primary) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, var(--accent-primary) 0%, transparent 50%)`,
        }}
      />

      <div className="relative max-w-md w-full">
        <div
          className="rounded-3xl shadow-2xl overflow-hidden transform transition-all duration-500 "
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="px-8 py-10">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transform transition-all duration-300 hover:rotate-12"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  boxShadow: "0 10px 25px rgba(26, 25, 83, 0.3)",
                }}
              >
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
              </div>
              <h2
                className="text-3xl font-bold mb-2 leading-relaxed"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Create Account
              </h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                Join us and get started today
              </p>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={registerSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, errors, touched }) => (
                <Form className="space-y-6 text-start" noValidate>
                  <div className="space-y-5">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2 leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Full Name
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          autoComplete="name"
                          className={`block w-full pl-10 pr-3 py-3 rounded-t-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 leading-relaxed ${
                            touched.name && errors.name ? "border-red-500" : ""
                          }`}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            borderColor:
                              touched.name && errors.name
                                ? "var(--error)"
                                : "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              "var(--accent-primary)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px rgba(26, 25, 83, 0.1)";
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              touched.name && errors.name
                                ? "var(--error)"
                                : "var(--border-color)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="Enter your full name"
                        />
                      </div>
                      <ErrorMessage name="name">
                        {(msg) => (
                          <p
                            className="mt-2 text-sm flex items-center leading-relaxed"
                            style={{ color: "var(--error)" }}
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2 leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Email Address
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          autoComplete="email"
                          className={`block w-full pl-10 pr-3 py-3 border transition-all duration-200 focus:ring-2 focus:ring-offset-2 leading-relaxed ${
                            touched.email && errors.email
                              ? "border-red-500"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            borderColor:
                              touched.email && errors.email
                                ? "var(--error)"
                                : "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              "var(--accent-primary)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px rgba(26, 25, 83, 0.1)";
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              touched.email && errors.email
                                ? "var(--error)"
                                : "var(--border-color)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="Enter your email"
                        />
                      </div>
                      <ErrorMessage name="email">
                        {(msg) => (
                          <p
                            className="mt-2 text-sm flex items-center leading-relaxed"
                            style={{ color: "var(--error)" }}
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-2 leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                        </div>
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          autoComplete="new-password"
                          className={`block w-full pl-10 pr-3 py-3 border transition-all duration-200 focus:ring-2 focus:ring-offset-2 leading-relaxed ${
                            touched.password && errors.password
                              ? "border-red-500"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            borderColor:
                              touched.password && errors.password
                                ? "var(--error)"
                                : "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              "var(--accent-primary)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px rgba(26, 25, 83, 0.1)";
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              touched.password && errors.password
                                ? "var(--error)"
                                : "var(--border-color)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="Create a password"
                        />
                      </div>
                      <ErrorMessage name="password">
                        {(msg) => (
                          <p
                            className="mt-2 text-sm flex items-center leading-relaxed"
                            style={{ color: "var(--error)" }}
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium mb-2 leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        Confirm Password
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg
                            className="h-5 w-5 transition-colors duration-200"
                            style={{ color: "var(--text-secondary)" }}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          autoComplete="new-password"
                          className={`block w-full pl-10 pr-3 py-3 rounded-b-xl border transition-all duration-200 focus:ring-2 focus:ring-offset-2 leading-relaxed ${
                            touched.confirmPassword && errors.confirmPassword
                              ? "border-red-500"
                              : ""
                          }`}
                          style={{
                            backgroundColor: "var(--input-bg)",
                            borderColor:
                              touched.confirmPassword && errors.confirmPassword
                                ? "var(--error)"
                                : "var(--border-color)",
                            color: "var(--text-primary)",
                          }}
                          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              "var(--accent-primary)";
                            e.currentTarget.style.boxShadow =
                              "0 0 0 3px rgba(26, 25, 83, 0.1)";
                          }}
                          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                            e.currentTarget.style.borderColor =
                              touched.confirmPassword && errors.confirmPassword
                                ? "var(--error)"
                                : "var(--border-color)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                          placeholder="Confirm your password"
                        />
                      </div>
                      <ErrorMessage name="confirmPassword">
                        {(msg) => (
                          <p
                            className="mt-2 text-sm flex items-center leading-relaxed"
                            style={{ color: "var(--error)" }}
                          >
                            <svg
                              className="h-4 w-4 mr-1"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                            {msg}
                          </p>
                        )}
                      </ErrorMessage>
                    </div>
                  </div>

                  {error && (
                    <div
                      className="rounded-xl p-4 flex items-start space-x-3 transform transition-all duration-300"
                      style={{
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        border: "1px solid rgba(239, 68, 68, 0.2)",
                      }}
                    >
                      <svg
                        className="h-5 w-5 flex-shrink-0 mt-0.5"
                        style={{ color: "var(--error)" }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium leading-relaxed"
                          style={{ color: "var(--error)" }}
                        >
                          {error}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleClearError}
                        className="inline-flex rounded-lg p-1.5 transition-all duration-200 hover:scale-110"
                        style={{ color: "var(--error)" }}
                      >
                        <span className="sr-only">Dismiss</span>
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  )}

                  <div className="space-y-4">
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="group relative w-full flex justify-center py-3 px-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none leading-relaxed"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                        color: "#ffffff",
                        boxShadow: "0 4px 15px rgba(26, 25, 83, 0.3)",
                      }}
                      onMouseEnter={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.boxShadow =
                            "0 8px 25px rgba(26, 25, 83, 0.4)";
                          e.currentTarget.style.transform =
                            "translateY(-2px) scale(1.02)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!e.currentTarget.disabled) {
                          e.currentTarget.style.boxShadow =
                            "0 4px 15px rgba(26, 25, 83, 0.3)";
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                        }
                      }}
                    >
                      {loading ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Create account
                          <svg
                            className="ml-2 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                          </svg>
                        </span>
                      )}
                    </button>

                    <div className="relative">
                      <div
                        className="absolute inset-0 flex items-center"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        <div
                          className="w-full border-t"
                          style={{ borderColor: "var(--border-color)" }}
                        ></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span
                          className="px-2 bg-transparent"
                          style={{ backgroundColor: "var(--card-bg)" }}
                        >
                          Or
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium transition-all duration-200 hover:scale-105 leading-relaxed"
                        style={{ color: "var(--primary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "var(--accent-primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "var(--primary)";
                        }}
                      >
                        Already have an account?
                        <span className="ml-1 font-semibold">Sign in</span>
                      </Link>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

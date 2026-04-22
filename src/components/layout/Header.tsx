// import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { logout } from "../../features/auth/authSlice";
import { useTheme } from "../../contexts/ThemeContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useI18n } from "../../contexts/I18nContext";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header
      className="shadow-sm border-b"
      style={{
        backgroundColor: "var(--header-bg)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="px-3 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Left side - Menu toggle and Logo */}
          <div className="flex items-center">
            {/* Mobile menu toggle - Hidden on desktop */}
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "var(--text-secondary)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "var(--text-muted)")
              }
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isSidebarOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
            <div className="ml-2 sm:ml-4 shrink-0 flex items-center">
              <h3
                className="text-[20px] sm:text-[28px] font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {t("common.adminDashboard")}
              </h3>
            </div>
          </div>

          {/* Right side - Language switcher, theme toggle, user info and logout */}
          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle button */}
            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "light" ? (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            <div className="hidden sm:flex items-center space-x-3">
              <div className="flex flex-col">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user?.name}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  {user?.email}
                </span>
              </div>
              <span
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border"
                style={{
                  background:
                    user?.role === "admin"
                      ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                      : "linear-gradient(135deg, #059669, #10b981)",
                  color: "#ffffff",
                  border: "none",
                }}
              >
                {user?.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 sm:p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200"
              style={{
                backgroundColor: "var(--hover-bg)",
                color: "var(--text-muted)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--active-bg)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                e.currentTarget.style.color = "var(--text-muted)";
              }}
              title="Logout"
            >
              <span className="sr-only">Logout</span>
              <svg
                className="h-4 w-4 sm:h-5 sm:w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
            {/* Mobile user indicator */}
            <div className="sm:hidden flex items-center">
              <div
                className="h-8 w-8 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  color: "#ffffff",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

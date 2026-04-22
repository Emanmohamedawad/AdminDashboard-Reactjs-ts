import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { useI18n } from "../../contexts/I18nContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();

  const navigation = [
    {
      name: t("common.dashboard"),
      href: "/dashboard",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: t("common.profile"),
      href: "/profile",
      icon: (
        <svg
          className="h-5 w-5"
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
      ),
    },
  ];

  if (user?.role === "admin") {
    navigation.push({
      name: t("common.users"),
      href: "/users",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
          />
        </svg>
      ),
    });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 sm:w-72 shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0 lg:w-64
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ backgroundColor: "var(--sidebar-bg)" }}
      >
        <div
          className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6 border-b lg:hidden"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2
            className="text-base sm:text-lg font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {t("navigation.menu")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md transition-all duration-200"
            style={{
              color: "var(--text-muted)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            <span className="sr-only">{t("navigation.closeSidebar")}</span>
            <svg
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-6 sm:mt-8 ">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => {
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 1024) {
                      onClose();
                    }
                  }}
                  className={`
                    group flex items-center px-4 py-3 sm:px-4 text-sm sm:text-base font-medium rounded-lg transition-all duration-200 mx-2 mb-1
                  `}
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, var(--primary), var(--accent-primary))"
                      : "transparent",
                    color: isActive ? "#ffffff" : "var(--text-secondary)",
                    transform: isActive ? "scale(1.02)" : "scale(1)",
                    boxShadow: isActive
                      ? "0 4px 12px rgba(26, 25, 83, 0.3)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                      e.currentTarget.style.transform = "translateX(4px)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.transform = "translateX(0)";
                    }
                  }}
                >
                  <div
                    className="mr-3 shrink-0 transition-all duration-200"
                    style={{
                      color: isActive ? "#ffffff" : "var(--text-muted)",
                    }}
                  >
                    <div className="h-5 w-5 sm:h-5 sm:w-5">{item.icon}</div>
                  </div>
                  <span className="truncate font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t"
          style={{
            borderColor: "var(--border-color)",
            background: "var(--surface)",
          }}
        >
          <div className="flex items-center space-x-3">
            <div className="shrink-0">
              <div
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-full flex items-center justify-center font-bold text-lg shadow-lg transition-all duration-200"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  color: "#ffffff",
                  boxShadow: "0 4px 12px rgba(26, 25, 83, 0.3)",
                }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="flex-1 min-w-0 hidden sm:block">
              <p
                className="text-sm font-semibold truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {user?.name}
              </p>
              <p
                className="text-xs truncate"
                style={{ color: "var(--text-muted)" }}
              >
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

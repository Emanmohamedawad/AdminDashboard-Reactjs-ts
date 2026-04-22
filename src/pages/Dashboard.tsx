import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../app/store";
import { useI18n } from "../contexts/I18nContext";

const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();

  if (!user) {
    return <div>{t("users.loading")}</div>;
  }

  return (
    <>
      <div
        className="rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 "
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="px-6 py-8 sm:p-8">
          <h3
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-relaxed"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--accent-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingBottom: "0.25rem",
            }}
          >
            {t("common.welcome")}
          </h3>

          <div
            className="rounded-lg overflow-hidden"
            style={{ border: "1px solid var(--border-color)" }}
          >
            <dl>
              <div
                className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4"
                style={{ backgroundColor: "var(--hover-bg)" }}
              >
                <dt
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("common.name")}
                </dt>
                <dd
                  className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.name}
                </dd>
              </div>
              <div
                className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <dt
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("common.email")}
                </dt>
                <dd
                  className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {user.email}
                </dd>
              </div>
              <div
                className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4"
                style={{ backgroundColor: "var(--hover-bg)" }}
              >
                <dt
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("common.role")}
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-0 shadow-md leading-relaxed"
                    style={{
                      background:
                        user.role === "admin"
                          ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                          : "linear-gradient(135deg, #059669, #10b981)",
                      color: "#ffffff",
                    }}
                  >
                    {user.role}
                  </span>
                </dd>
              </div>
              <div
                className="px-6 py-5 sm:grid sm:grid-cols-3 sm:gap-4"
                style={{ backgroundColor: "var(--card-bg)" }}
              >
                <dt
                  className="text-sm font-semibold leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {t("common.memberSince")}
                </dt>
                <dd
                  className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {new Date(user.createdAt).toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          to="/profile"
          className="group relative block w-full rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "1px solid var(--border-color)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 20px 25px -5px rgba(26, 25, 83, 0.2), 0 10px 10px -5px rgba(26, 25, 83, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
          }}
        >
          <div className="flex items-center">
            <div
              className="shrink-0 p-3 rounded-lg"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <svg
                className="h-6 w-6"
                style={{ color: "var(--primary)" }}
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
            <div className="ml-4">
              <p
                className="text-lg font-semibold leading-relaxed"
                style={{ color: "var(--text-primary)" }}
              >
                {t("common.profile")}
              </p>
              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {t("dashboard.viewAndEditProfile")}
              </p>
            </div>
          </div>
        </Link>

        {user.role === "admin" && (
          <Link
            to="/users"
            className="group relative block w-full rounded-xl p-6 shadow-lg transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 20px 25px -5px rgba(26, 25, 83, 0.2), 0 10px 10px -5px rgba(26, 25, 83, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div className="flex items-center">
              <div
                className="shrink-0 p-3 rounded-lg"
                style={{ backgroundColor: "var(--hover-bg)" }}
              >
                <svg
                  className="h-6 w-6"
                  style={{ color: "var(--primary)" }}
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
              </div>
              <div className="ml-4">
                <p
                  className="text-lg font-semibold leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("common.users")}
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {t("dashboard.manageUsers")}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default Dashboard;

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../app/store";
import {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  setUsersPage,
  setUsersLimit,
} from "../features/users/usersSlice";
import { usersAPI } from "../services/authAPI";
import type { UsersQueryParams, User } from "../types/index";
import { useI18n } from "../contexts/I18nContext";
import {
  canDeleteUser,
  canChangeUserRole,
  getRoleBadgeStyles,
} from "../utils/auth";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error, total, page, limit } = useSelector(
    (state: RootState) => state.users,
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "email" | "role" | "createdAt">(
    "createdAt",
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [newRole, setNewRole] = useState<"admin" | "user">("user");

  const fetchUsers = useCallback(
    async (params?: UsersQueryParams) => {
      try {
        dispatch(fetchUsersStart());
        const response = await usersAPI.getUsers(params);
        dispatch(fetchUsersSuccess(response));
      } catch (error: unknown) {
        dispatch(
          fetchUsersFailure(
            error instanceof Error ? error.message : "Failed to fetch users",
          ),
        );
      }
    },
    [dispatch],
  );

  useEffect(() => {
    fetchUsers({ page, limit, search, sortBy, sortOrder });
  }, [page, limit, search, sortBy, sortOrder, fetchUsers]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleDeleteUser = async (user: User) => {
    if (!canDeleteUser(currentUser, user)) return;

    try {
      await usersAPI.deleteUser(user.id);
      // Refresh users list
      await fetchUsers({ page, limit, search, sortBy, sortOrder });
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error: unknown) {
      console.error("Failed to delete user:", error);
      // You could add toast notification here
    }
  };

  const handleChangeRole = async (user: User, role: "admin" | "user") => {
    if (!canChangeUserRole(currentUser, user)) return;

    try {
      await usersAPI.updateUser(user.id, { role });
      // Refresh users list
      await fetchUsers({ page, limit, search, sortBy, sortOrder });
      setShowRoleModal(false);
      setSelectedUser(null);
      setNewRole("user");
    } catch (error: unknown) {
      console.error("Failed to change user role:", error);
      // You could add toast notification here
    }
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const openRoleModal = (user: User) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleModal(true);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setShowRoleModal(false);
    setSelectedUser(null);
    setNewRole("user");
  };

  const handleSort = (column: "name" | "email" | "role" | "createdAt") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setUsersPage(newPage));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setUsersLimit(newLimit));
    dispatch(setUsersPage(1)); // Reset to first page
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div
      className="rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="px-6 py-8 sm:p-10">
        <div className="flex justify-between items-center mb-8">
          <h2
            className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-relaxed"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--accent-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              paddingBottom: "0.25rem",
            }}
          >
            {t("common.users")}
          </h2>
          <Link
            to="/dashboard"
            className="group inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: "var(--card-bg)",
              color: "var(--text-secondary)",
              border: "1px solid var(--border-color)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--hover-bg)";
              e.currentTarget.style.color = "var(--text-primary)";
              e.currentTarget.style.transform = "translateX(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--card-bg)";
              e.currentTarget.style.color = "var(--text-secondary)";
              e.currentTarget.style.transform = "translateX(0)";
            }}
          >
            <svg
              className="h-5 w-5 mr-2"
              style={{ color: "var(--primary)" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7v14a2 2 0 002-2H6a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            <span>{t("common.backToDashboard")}</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder={t("users.searchUsers")}
                value={search}
                onChange={handleSearch}
                className="block w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-offset-2 leading-relaxed"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(26, 25, 83, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div
        className="border-t rounded-lg overflow-hidden"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead
              className="px-6 py-4"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer transition-all duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => handleSort("name")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {t("common.name")}{" "}
                  {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer transition-all duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => handleSort("email")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {t("common.email")}{" "}
                  {sortBy === "email" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer transition-all duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => handleSort("role")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {t("common.role")}{" "}
                  {sortBy === "role" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-semibold cursor-pointer transition-all duration-200"
                  style={{ color: "var(--text-secondary)" }}
                  onClick={() => handleSort("createdAt")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  {t("users.created")}{" "}
                  {sortBy === "createdAt" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">{t("users.actions")}</span>
                </th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "var(--card-bg)" }}>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className="animate-spin rounded-full h-8 w-8 border-b-2 mb-3"
                        style={{ borderColor: "var(--primary)" }}
                      ></div>
                      {t("users.loading")}
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-8 text-center text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t("users.noUsersFound")}
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="transition-all duration-200"
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? "var(--card-bg)" : "var(--hover-bg)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--border-color)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? "var(--card-bg)" : "var(--hover-bg)";
                    }}
                  >
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm font-medium leading-relaxed"
                      style={{
                        color: "var(--text-primary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {user.name}
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm leading-relaxed"
                      style={{
                        color: "var(--text-secondary)",
                        lineHeight: "1.5",
                      }}
                    >
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-0 shadow-md leading-relaxed"
                        style={getRoleBadgeStyles(user.role)}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 whitespace-nowrap text-sm"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {/* Edit button - show if user can edit this user */}
                        {/* {canEditUser(currentUser, user) && (
                          <Link
                            to={`/users/${user.id}/edit`}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 leading-relaxed"
                            style={{
                              backgroundColor: "var(--primary)",
                              color: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "var(--accent-primary)";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(26, 25, 83, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor =
                                "var(--primary)";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {t("users.edit")}
                          </Link>
                        )} */}

                        {/* Change Role button - show only for admins and not on themselves */}
                        {canChangeUserRole(currentUser, user) && (
                          <button
                            onClick={() => openRoleModal(user)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 leading-relaxed"
                            style={{
                              backgroundColor: "#f59e0b",
                              color: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#d97706";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(245, 158, 11, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#f59e0b";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {t("users.changeRole")}
                          </button>
                        )}

                        {/* Delete button - show only for admins and not on themselves */}
                        {canDeleteUser(currentUser, user) && (
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105 leading-relaxed"
                            style={{
                              backgroundColor: "#ef4444",
                              color: "#ffffff",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = "#dc2626";
                              e.currentTarget.style.boxShadow =
                                "0 4px 12px rgba(239, 68, 68, 0.3)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = "#ef4444";
                              e.currentTarget.style.boxShadow = "none";
                            }}
                          >
                            {t("users.delete")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className="px-6 py-6 flex items-center justify-between border-t"
          style={{ borderColor: "var(--border-color)" }}
        >
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
              className="relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 leading-relaxed"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {t("users.previous")}
            </button>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "var(--card-bg)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-color)",
              }}
              onMouseEnter={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.disabled) {
                  e.currentTarget.style.backgroundColor = "var(--card-bg)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              {t("users.next")}
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t("users.showing")}{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {(page - 1) * limit + 1}
                </span>{" "}
                {t("users.to")}{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {Math.min(page * limit, total)}
                </span>{" "}
                {t("users.of")}{" "}
                <span
                  className="font-medium"
                  style={{ color: "var(--text-primary)" }}
                >
                  {total}
                </span>{" "}
                {t("users.results")}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={limit}
                onChange={(e) => handleLimitChange(Number(e.target.value))}
                className="px-3 py-2 rounded-lg text-sm border transition-all duration-200 leading-relaxed"
                style={{
                  backgroundColor: "var(--input-bg)",
                  borderColor: "var(--border-color)",
                  color: "var(--text-primary)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent-primary)";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(26, 25, 83, 0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-color)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <option value={10}>10 {t("users.perPage")}</option>
                <option value={25}>25 {t("users.perPage")}</option>
                <option value={50}>50 {t("users.perPage")}</option>
              </select>
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-3 py-2 rounded-l-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 leading-relaxed"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "var(--card-bg)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {t("users.previous")}
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum =
                    Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className="relative inline-flex items-center px-4 py-2 text-sm font-medium transition-all duration-200 leading-relaxed"
                      style={{
                        backgroundColor:
                          pageNum === page
                            ? "var(--primary)"
                            : "var(--card-bg)",
                        color:
                          pageNum === page
                            ? "#ffffff"
                            : "var(--text-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                      onMouseEnter={(e) => {
                        if (pageNum !== page) {
                          e.currentTarget.style.backgroundColor =
                            "var(--hover-bg)";
                          e.currentTarget.style.color = "var(--text-primary)";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (pageNum !== page) {
                          e.currentTarget.style.backgroundColor =
                            "var(--card-bg)";
                          e.currentTarget.style.color = "var(--text-secondary)";
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages}
                  className="relative inline-flex items-center px-3 py-2 rounded-r-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 leading-relaxed"
                  style={{
                    backgroundColor: "var(--card-bg)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.disabled) {
                      e.currentTarget.style.backgroundColor = "var(--card-bg)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {t("users.next")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div
          className="mt-4 rounded-lg p-6 transform transition-all duration-300"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
          }}
        >
          <div
            className="text-sm font-medium leading-relaxed"
            style={{ color: "var(--error)" }}
          >
            {error}
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-bold mb-4 leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {t("users.deleteUser")}
            </h3>
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("users.deleteUserConfirmation", { name: selectedUser.name })}
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 leading-relaxed"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--input-bg)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleDeleteUser(selectedUser)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 leading-relaxed"
                style={{
                  backgroundColor: "#ef4444",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#dc2626";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef4444";
                }}
              >
                {t("users.delete")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="rounded-2xl p-6 max-w-md w-full mx-4 transform transition-all duration-300"
            style={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h3
              className="text-lg font-bold mb-4 leading-relaxed"
              style={{ color: "var(--text-primary)" }}
            >
              {t("users.changeUserRole")}
            </h3>
            <p
              className="text-sm mb-6 leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              {t("users.changeRoleConfirmation", { name: selectedUser.name })}
            </p>
            <div className="space-y-3 mb-6">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={newRole === "user"}
                  onChange={(e) =>
                    setNewRole(e.target.value as "admin" | "user")
                  }
                  className="w-4 h-4"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("roles.user")}
                </span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={newRole === "admin"}
                  onChange={(e) =>
                    setNewRole(e.target.value as "admin" | "user")
                  }
                  className="w-4 h-4"
                  style={{ accentColor: "var(--primary)" }}
                />
                <span
                  className="text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t("roles.admin")}
                </span>
              </label>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeModals}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 leading-relaxed"
                style={{
                  backgroundColor: "var(--input-bg)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--hover-bg)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--input-bg)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={() => handleChangeRole(selectedUser, newRole)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 leading-relaxed"
                style={{
                  backgroundColor: "#f59e0b",
                  color: "#ffffff",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#d97706";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#f59e0b";
                }}
              >
                {t("users.changeRole")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

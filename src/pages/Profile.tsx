import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import {
  fetchProfileStart,
  fetchProfileSuccess,
  fetchProfileFailure,
  updateProfileStart,
  updateProfileSuccess,
  updateProfileFailure,
  clearProfileError,
} from "../features/profile/profileSlice";
import { loginSuccess } from "../features/auth/authSlice";
import { profileAPI, usersAPI } from "../services/authAPI";
import { useI18n } from "../contexts/I18nContext";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.profile,
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useI18n();

  const isOwnProfile = !userId || userId === String(currentUser?.id);
  const canEdit = isOwnProfile || currentUser?.role === "admin";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        dispatch(fetchProfileStart());
        const response = isOwnProfile
          ? await usersAPI.getUser(currentUser!.id)
          : await usersAPI.getUser(userId!); // In a real app, you'd have a separate endpoint for admin viewing other profiles
        dispatch(fetchProfileSuccess(response));
        reset({ name: response.name, email: response.email });
      } catch (error: unknown) {
        dispatch(
          fetchProfileFailure(
            error instanceof Error ? error.message : "Failed to fetch profile",
          ),
        );
      }
    };

    if ((isOwnProfile && currentUser) || (!isOwnProfile && userId)) {
      fetchProfile();
    }
  }, [dispatch, isOwnProfile, reset, currentUser, userId]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      dispatch(updateProfileStart());

      // Use different API endpoints based on whether updating own profile or admin updating another user
      const response = isOwnProfile
        ? await profileAPI.updateProfile(data)
        : await usersAPI.updateUser(userId!, data);

      dispatch(updateProfileSuccess(response));

      // If updating own profile, also update auth state and localStorage
      if (isOwnProfile && currentUser) {
        // Update auth state with new user information
        dispatch(
          loginSuccess({
            user: response,
            token: localStorage.getItem("token") || "",
          }),
        );

        // Update localStorage with new user data
        localStorage.setItem("user", JSON.stringify(response));
      }

      setIsEditing(false);
    } catch (error: unknown) {
      dispatch(
        updateProfileFailure(
          error instanceof Error ? error.message : "Failed to update profile",
        ),
      );
    }
  };

  const handleCancel = () => {
    if (profile) {
      reset({ name: profile.name, email: profile.email });
    }
    setIsEditing(false);
    dispatch(clearProfileError());
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Profile not found</p>
          <Link
            to="/dashboard"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
            className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), var(--accent-primary))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {isOwnProfile
              ? t("common.myProfile")
              : t("common.userProfile", { name: profile?.name || "" })}
          </h2>
          <div className="flex space-x-3">
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
            {canEdit && !isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="group inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: "0 4px 12px rgba(26, 25, 83, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 20px rgba(26, 25, 83, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 4px 12px rgba(26, 25, 83, 0.3)";
                }}
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2H5a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2m-3 7h8a3 3 0 01-3 3v8a3 3 0 003 3h6a3 3 0 003-3z"
                  />
                </svg>
                <span>{t("common.editProfile")}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div
        className="border-t rounded-lg overflow-hidden"
        style={{ borderColor: "var(--border-color)" }}
      >
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-8 sm:p-10">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Name
                </label>
                <input
                  {...register("name")}
                  type="text"
                  id="name"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-offset-2"
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
                {errors.name && (
                  <p
                    className="mt-2 text-sm font-medium p-3 rounded-lg"
                    style={{
                      color: "var(--error)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Email
                </label>
                <input
                  {...register("email")}
                  type="email"
                  id="email"
                  className="mt-1 block w-full px-4 py-3 rounded-lg border transition-all duration-200 focus:ring-2 focus:ring-offset-2"
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
                {errors.email && (
                  <p
                    className="mt-2 text-sm font-medium p-3 rounded-lg"
                    style={{
                      color: "var(--error)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                    }}
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="col-span-6">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Role
                </label>
                <div className="mt-3">
                  <span
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-0 shadow-md"
                    style={{
                      background:
                        profile?.role === "admin"
                          ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                          : "linear-gradient(135deg, #059669, #10b981)",
                      color: "#ffffff",
                    }}
                  >
                    {profile.role}
                  </span>
                  {currentUser?.role === "admin" && !isOwnProfile && (
                    <p
                      className="mt-2 text-sm"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Admin can change role from users list
                    </p>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div
                className="mt-4 rounded-lg p-6 transform transition-all duration-300"
                style={{
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                }}
              >
                <div
                  className="text-sm font-medium"
                  style={{ color: "var(--error)" }}
                >
                  {error}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={handleCancel}
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
                    d="M6 18L18 6M6 6l12 12m-3 0l-6-6m6 6v12a2 2 0 002-2h8a2 2 0 002 2v4a2 2 0 002-2m-3 7h8a3 3 0 01-3 3v8a3 3 0 003 3h6a3 3 0 003-3z"
                  />
                </svg>
                <span>Cancel</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="group inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "linear-gradient(135deg, #9ca3af, #6b7280)"
                    : "linear-gradient(135deg, var(--primary), var(--accent-primary))",
                  color: "#ffffff",
                  border: "none",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 12px rgba(26, 25, 83, 0.3)",
                }}
                onMouseEnter={
                  !loading
                    ? (e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 8px 20px rgba(26, 25, 83, 0.4)";
                      }
                    : undefined
                }
                onMouseLeave={
                  !loading
                    ? (e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(26, 25, 83, 0.3)";
                      }
                    : undefined
                }
              >
                <svg
                  className="h-5 w-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {loading ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v2a1 1 0 00-1h1a1 1 0 001 1v2a1 1 0 001 1h1a1 1 0 001 1v4a1 1 0 001-1h-1a1 1 0 00-1-1z"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  )}
                </svg>
                <span>{loading ? "Saving..." : "Save Changes"}</span>
              </button>
            </div>
          </form>
        ) : (
          <dl>
            <div
              className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <dt
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Name
              </dt>
              <dd
                className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                {profile.name}
              </dd>
            </div>
            <div
              className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <dt
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email
              </dt>
              <dd
                className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                {profile.email}
              </dd>
            </div>
            <div
              className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <dt
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Role
              </dt>
              <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border-0 shadow-md"
                  style={{
                    background:
                      profile?.role === "admin"
                        ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                        : "linear-gradient(135deg, #059669, #10b981)",
                    color: "#ffffff",
                  }}
                >
                  {profile.role}
                </span>
              </dd>
            </div>
            <div
              className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <dt
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Member since
              </dt>
              <dd
                className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                {new Date(profile.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div
              className="px-6 py-6 sm:grid sm:grid-cols-3 sm:gap-4"
              style={{ backgroundColor: "var(--hover-bg)" }}
            >
              <dt
                className="text-sm font-semibold mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Last updated
              </dt>
              <dd
                className="mt-1 text-sm sm:mt-0 sm:col-span-2 font-medium p-4 rounded-lg"
                style={{
                  backgroundColor: "var(--card-bg)",
                  color: "var(--text-primary)",
                }}
              >
                {new Date(profile.updatedAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        )}
      </div>
    </div>
  );
};

export default Profile;

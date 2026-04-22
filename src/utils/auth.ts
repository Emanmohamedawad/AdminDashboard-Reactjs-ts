import type { User } from "../types/index";

/**
 * Check if the current user has admin role
 */
export const isAdmin = (user: User | null): boolean => {
  return user?.role === "admin";
};

/**
 * Check if the current user can edit the target user
 * Admins can edit any user, regular users can only edit themselves
 */
export const canEditUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;
  
  // Admins can edit any user
  if (currentUser.role === "admin") return true;
  
  // Users can only edit themselves
  return currentUser.id === targetUser.id;
};

/**
 * Check if the current user can delete the target user
 * Only admins can delete users, and they cannot delete themselves
 */
export const canDeleteUser = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;
  
  // Only admins can delete users
  if (currentUser.role !== "admin") return false;
  
  // Admins cannot delete themselves
  return currentUser.id !== targetUser.id;
};

/**
 * Check if the current user can change the target user's role
 * Only admins can change roles, and they cannot change their own role
 */
export const canChangeUserRole = (currentUser: User | null, targetUser: User): boolean => {
  if (!currentUser) return false;
  
  // Only admins can change roles
  if (currentUser.role !== "admin") return false;
  
  // Admins cannot change their own role
  return currentUser.id !== targetUser.id;
};

/**
 * Get user-friendly role display text
 */
export const getRoleDisplayText = (role: "admin" | "user"): string => {
  return role === "admin" ? "Administrator" : "User";
};

/**
 * Get role badge styling
 */
export const getRoleBadgeStyles = (role: "admin" | "user") => {
  return role === "admin"
    ? {
        background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
        color: "#ffffff",
      }
    : {
        background: "linear-gradient(135deg, #059669, #10b981)",
        color: "#ffffff",
      };
};

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser, logoutUser } from "@/store/auth/auth.slice";
import { UserRole } from "@/types/auth";
import { useRouter } from "next/navigation";

export const useAuth = () => {
  const authState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!authState.user) return false;

    const userRole = authState.user.role as unknown as UserRole;

    if (Array.isArray(role)) {
      return role.includes(userRole);
    }

    return userRole === role;
  };

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      dispatch(setUser({ user: data.user, isAuth: true }));

      return { success: true, user: data.user };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Failed to login",
      };
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  const updateUser = (userData: any) => {
    dispatch(
      setUser({ user: { ...authState.user, ...userData }, isAuth: true })
    );
  };

  return {
    ...authState,
    handleLogin,
    handleLogout,
    updateUser,
    hasRole,
  };
};

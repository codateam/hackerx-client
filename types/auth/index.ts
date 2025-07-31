export interface RoleType {
  id: string;
  roleType: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = "student" | "lecturer" | "admin" | "super_admin";

export interface UserType {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  userToken?: string;
  matricNo?: string;
  organizationId?: string;
}

export interface InitialAuthState {
  isAuth: boolean;
  user: UserType | null;
  isNewUser: boolean;
  isLoading: boolean;
}

export interface RootReducerType {
  auth: InitialAuthState;
}

export interface ResponseType<T> {
  status?: number;
  message?: string;
  data: T;
  success?: boolean;
}

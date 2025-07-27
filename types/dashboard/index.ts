export type MenuItem = {
  id: string;
  label: string;
  path: string;
  icon?: string;
  requiredRole?: "admin" | "lecturer" | "student" | null;
  children?: MenuItem[];
};

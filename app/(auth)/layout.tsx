import { NavBar } from "@/components/Navbar/page";
import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col gap-10 min-h-screen">
      <NavBar />
      {children}
    </div>
  );
};

export default AuthLayout;

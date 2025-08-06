"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import DashboardNavBar from "@/components/DashboardNavBar/DashboardNavBar";
import Menu from "@/components/Menu/Menu";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { user, isAuth, handleLogout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    if (user?.role) {
      const pathSegments = pathname.split("/");
      const currentBaseRoute = pathSegments.length > 1 ? pathSegments[1] : "";
      if (
        ["admin", "lecturer", "student"].includes(currentBaseRoute) &&
        currentBaseRoute !== user.role
      ) {
        router.push(`/${user.role}`);
      }

      if (pathname === "/") {
        router.push(`/${user.role}`);
      }
    }
  }, [isAuth, user, router, pathname]);

  if (!isAuth || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-row h-screen bg-white overflow-hidden">
      {/* LEFT SIDEBAR */}
      <div className="w-20 lg:w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen fixed">
        <div className="flex justify-center lg:justify-start mb-10">
          <Image
            src="/images/chachiLogo.png"
            alt="Logo"
            width={150}
            height={50}
            className="w-[50px] lg:w-[150px] h-auto"
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          <Menu />
        </div>
        <div className="mt-auto mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center lg:justify-start gap-4 w-full text-red-500 py-2 md:px-2 rounded-md hover:bg-red-50"
          >
            <LogOut size={24} />
            <span className="hidden lg:block font-medium">Log Out</span>
          </button>
        </div>
      </div>

      {/* RIGHT CONTENT */}
      <div className="flex-1 flex flex-col ml-20 lg:ml-64">
        <DashboardNavBar />
        <div className="p-6 flex-1 bg-[#F3F3FB] overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </div>
      </div>
    </div>
  );
}

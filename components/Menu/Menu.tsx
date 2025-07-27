import { useAuth } from "@/features/auth/hooks/useAuth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { menuItems } from "./utils/constant";


const Menu = () => {
  const { user } = useAuth();
  const pathname = usePathname();

  if (!user) {
    return null;
  }

  const role = user.role;

  const getBasePath = () => {
    const path = pathname.split("/");
    if (path.length > 1 && ["admin", "lecturer", "student"].includes(path[1])) {
      return `/${path[1]}`;
    }
    return `/${role}`;
  };

  const getRoutePath = (href) => {
    if (href === "/") {
      return getBasePath();
    }
    return `${getBasePath()}${href}`;
  };

  return (
    <div className="mt-4 text-xs lg:text-lg flex flex-col gap-6">
      {menuItems.map(
        (item, index) =>
          item.visible.includes(role) && (
            <Link
              href={getRoutePath(item.href)}
              key={index}
              className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-blue-50"
            >
              <Image src={item.icon} alt="" width={30} height={30} />
              <span className="hidden lg:block font-medium text-black">
                {item.label}
              </span>
            </Link>
          )
      )}
    </div>
  );
};

export default Menu;

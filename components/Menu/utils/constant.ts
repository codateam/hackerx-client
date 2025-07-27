export const menuItems = [
  {
    icon: "/icons/home.svg",
    label: "Home",
    href: "/",
    visible: ["admin", "lecturer", "student"],
  },
  {
    icon: "/icons/assessment.svg",
    label: "Manage Course",
    href: "/courses",
    visible: ["admin", "lecturer"],
  },
  {
    icon: "/icons/course.svg",
    label: "My Courses",
    href: "/courses",
    visible: ["student"],
  },
  {
    icon: "/icons/analytics.svg",
    label: "Reports",
    href: "/reports",
    visible: ["admin", "lecturer", "student"],
  },
  {
    icon: "/icons/help.svg",
    label: "Help",
    href: "/help",
    visible: ["admin", "lecturer", "student"],
  },
];

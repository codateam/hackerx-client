export const links = [
  {
    id: 1,
    title: "About Us",
    path: "/about-us",
  },
  {
    id: 2,
    title: "Help",
    path: "/help",
  },
  {
    id: 3,
    title: "Contact",
    path: "/contact",
    isAuth: false,
  },
  {
    id: 4,
    title: "Login",
    path: "/login",
    isAuth: false,
  },
  {
    id: 5,
    title: "Sign Up",
    path: "/sign-up",
    isAuth: true,
  },
];

export const menuVars = {
  initial: {
    scaleY: 0,
  },
  animate: {
    scaleY: 1,
    transition: {
      duration: 0.5,
      ease: [0.12, 0, 0.39, 0]  as const,
    },
  },
  exit: {
    scaleY: 0,
    transition: {
      delay: 0.5,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]  as const,
    },
  },
};
export const containerVars = {
  initial: {
    transition: {
      staggerChildren: 0.09,
      staggerDirection: -1,
    },
  },
  open: {
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.09,
      staggerDirection: 1,
    },
  },
};

export const mobileLinkVars = {
  initial: {
    y: "30vh",
    transition: {
      duration: 0.5,
      ease: [0.37, 0, 0.63, 1]  as const,
    },
  },
  open: {
    y: 0,
    transition: {
      ease: [0, 0.55, 0.45, 1]  as const,
      duration: 0.7,
    },
  },
};


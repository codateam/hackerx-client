"use client";

import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FC, useState } from "react";
import { FaBars } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import {
  links,
  menuVars,
  containerVars,
  mobileLinkVars,
} from "./utils/constant";

const Logo: FC<{ className?: string }> = ({ className = "" }) => (
  <Link href="/">
    <Image
      alt="Logo"
      src="/images/logo.png"
      width={76}
      height={42}
      className={`md:hidden ${className}`}
      style={{ objectFit: "contain" }}
    />
    <Image
      alt="Logo"
      src="/images/logo.png"
      width={116}
      height={62}
      className={`hidden md:block ${className}`}
      style={{ objectFit: "contain" }}
    />
  </Link>
);

const MenuToggle: FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => (
  <button
    className="block cursor-pointer text-2xl font-bold text-black md:hidden"
    onClick={onClick}
    aria-label={isOpen ? "Close menu" : "Open menu"}
  >
    <FaBars />
  </button>
);

const SearchBar: FC = () => (
  <div className="hidden lg:flex items-center gap-4 flex-1 max-w-xs mx-8">
    <div className="relative w-full">
      <Input
        type="search"
        placeholder="Search"
        className="pl-10 border-2 border-black bg-inherit rounded-full outline-none placeholder:text-black placeholder:font-medium text-black"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black h-6 w-6" />
    </div>
  </div>
);

const DesktopNav: FC = () => (
  <div className="hidden md:flex items-center gap-10">
    {links.map((link) => (
      <Link
        key={link.id}
        href={`/${link.title.toLowerCase().replace(" ", "-")}`}
        className="text-black text-xl hover:text-[#475edf] transition-colors font-medium"
      >
        {link.title}
      </Link>
    ))}
  </div>
);

const MobileNavLink: FC<{ title: string; path: string }> = ({
  title,
  path,
}) => (
  <motion.div variants={mobileLinkVars} className="text-2xl uppercase text-white">
    <Link href={path}>{title}</Link>
  </motion.div>
);

const MobileMenu: FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={menuVars}
        initial="initial"
        animate="animate"
        exit="exit"
        className="fixed left-0 top-0 z-[999] h-full w-full origin-top bg-black p-6 text-white"
      >
        <div className="flex h-full flex-col">
          <div className="flex justify-between items-center">
            <Logo />
            <button
              className="cursor-pointer text-2xl text-white"
              onClick={onClose}
              aria-label="Close menu"
            >
              <MdClose />
            </button>
          </div>

          <motion.div
            variants={containerVars}
            initial="initial"
            animate="open"
            exit="initial"
            className="my-10 flex h-full flex-col justify-center items-center gap-10"
          >
            {links.map((link) => (
              <div className="overflow-hidden" key={link.id}>
                <MobileNavLink title={link.title} path={link.path} />
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => setIsOpen(!isOpen);
  const closeNav = () => setIsOpen(false);

  return (
    <>
      <nav className="container mx-auto p-4 md:p-6 flex items-center justify-between">
        <Logo />
        <MenuToggle isOpen={isOpen} onClick={toggleNav} />
        <SearchBar />
        <DesktopNav />
      </nav>
      <MobileMenu isOpen={isOpen} onClose={closeNav} />
    </>
  );
}
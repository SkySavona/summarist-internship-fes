"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";
import { AiOutlineHome } from "react-icons/ai";
import { PiBookmarkSimple } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { CgSearch } from "react-icons/cg";
import { BsGear } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { User } from "firebase/auth";
import { auth } from "@/services/firebase";

const iconMap = {
  AiOutlineHome,
  PiBookmarkSimple,
  LuPencilLine,
  CgSearch,
  BsGear,
  IoMdHelpCircleOutline,
  CiLogin,
};

type IconName = keyof typeof iconMap;

interface SidebarLink {
  iconName: IconName;
  route: string;
  label: string;
  cursorTo: string;
}

const sidebarLinks: ReadonlyArray<SidebarLink> = [
  { iconName: "AiOutlineHome", route: "/", label: "Home", cursorTo: "pointer" },
  { iconName: "PiBookmarkSimple", route: "/library", label: "My Library", cursorTo: "pointer" },
  { iconName: "LuPencilLine", route: "/for-you", label: "For You", cursorTo: "pointer" },
  { iconName: "CgSearch", route: "/search", label: "Search", cursorTo: "pointer" },
  { iconName: "BsGear", route: "/settings", label: "Settings", cursorTo: "pointer" },
  { iconName: "IoMdHelpCircleOutline", route: "/help", label: "Help & Support", cursorTo: "pointer" },
];

const SidebarLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const renderLink = (
    { route, label, iconName, cursorTo }: SidebarLink,
    isFooter = false
  ) => {
    const Icon = iconMap[iconName];
    const isActive = pathname === route;
    return (
      <Link
        key={label}
        href={route}
        style={{ cursor: cursorTo }}
        className={cn(
          "flex items-center gap-3 py-2 transition-colors duration-300 ease-in-out -mx-4 px-4 hover:bg-gray-200",
          {
            "bg-nav-focus border-l-4 border-green-1": isActive,
          }
        )}
      >
        {Icon && <Icon className="text-xl" />}
        <span className="text-blue-1">{label}</span>
      </Link>
    );
  };

  const [mainLinks, footerLinks] = sidebarLinks.reduce(
    (acc, link) => {
      acc[["Settings", "Help & Support"].includes(link.label) ? 1 : 0].push(
        link
      );
      return acc;
    },
    [[], []] as [SidebarLink[], SidebarLink[]]
  );

  return (
    <div className="flex">
      <section className="left_sidebar flex flex-col h-[100vh] bg-white shadow-md w-64 py-6 px-4">
        <div className="flex-grow">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image
              src="/assets/logo.png"
              alt="Summarist logo"
              width={125}
              height={25}
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>
          <nav className="flex flex-col gap-4">
            {mainLinks.map((link) => renderLink(link))}
          </nav>
        </div>
        <div className="mt-auto">
          {footerLinks.map((link) => renderLink(link, true))}
          <LoginButton user={user} loading={loading} className="mt-4">
            {user ? "Sign Out" : "Login"}
          </LoginButton>
        </div>
      </section>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default SidebarLayout;
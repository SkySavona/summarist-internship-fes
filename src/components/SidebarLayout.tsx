"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";
import { AiOutlineHome, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { PiBookmarkSimple } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { CgSearch } from "react-icons/cg";
import { BsGear } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { User } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";

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
  {
    iconName: "AiOutlineHome",
    route: "/for-you",
    label: "For You",
    cursorTo: "pointer",
  },
  {
    iconName: "PiBookmarkSimple",
    route: "/my-library",
    label: "My Library",
    cursorTo: "pointer",
  },
  {
    iconName: "LuPencilLine",
    route: "#",
    label: "Highlights",
    cursorTo: "not-allowed",
  },
  {
    iconName: "CgSearch",
    route: "/search",
    label: "Search",
    cursorTo: "not-allowed",
  },
  {
    iconName: "BsGear",
    route: "/settings",
    label: "Settings",
    cursorTo: "pointer",
  },
  {
    iconName: "IoMdHelpCircleOutline",
    route: "/help",
    label: "Help & Support",
    cursorTo: "not-allowed",
  },
];

interface SidebarLayoutProps {
  children: React.ReactNode;
  onLoginClick?: () => void;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  children,
  onLoginClick,
}) => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
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
          "flex items-center gap-3 py-2 text-blue-1 transition-colors duration-300 ease-in-out -mx-4 px-4 hover:bg-gray-200",
          {
            "bg-nav-focus border-l-4 border-green-1": isActive,
          }
        )}
        onClick={() => setIsOpen(false)}
      >
        {Icon && <Icon className="text-xl !text-blue-1 " />}
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
      <button
        className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-blue-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={24} />
      </button>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-md transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen,
          }
        )}
      >
        <div className="flex flex-col h-full py-6 px-4">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/logo.png"
                alt="Summarist logo"
                width={125}
                height={25}
                style={{ width: "auto", height: "auto" }}
                priority
              />
            </Link>
            <button
              className="lg:hidden text-blue-1"
              onClick={() => setIsOpen(false)}
            >
              <AiOutlineClose size={24} />
            </button>
          </div>
          <div className="flex-grow">
            <nav className="flex flex-col gap-4">
              {mainLinks.map((link) => renderLink(link))}
            </nav>
          </div>
          <div className="mt-auto">
            {footerLinks.map((link) => renderLink(link, true))}
            <LoginButton
              user={user}
              loading={loading}
              className="mt-4"
              onClick={onLoginClick}
            >
              {user ? "Sign Out" : "Login"}
            </LoginButton>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-0 lg:ml-64 transition-margin duration-300 ease-in-out relative">
        {children}
      </main>
    </div>
  );
};

export default SidebarLayout;

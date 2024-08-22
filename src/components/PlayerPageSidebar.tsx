"use client";

import React, { useState } from "react";
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
import { useAuthState } from "react-firebase-hooks/auth";
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
  { iconName: "AiOutlineHome", route: "/for-you", label: "For You", cursorTo: "pointer" },
  { iconName: "PiBookmarkSimple", route: "/library", label: "My Library", cursorTo: "pointer" },
  { iconName: "LuPencilLine", route: "#", label: "Highlights", cursorTo: "not-allowed" },
  { iconName: "CgSearch", route: "/search", label: "Search", cursorTo: "not-allowed" },
  { iconName: "BsGear", route: "/settings", label: "Settings", cursorTo: "pointer" },
  { iconName: "IoMdHelpCircleOutline", route: "#", label: "Help & Support", cursorTo: "not-allowed" },
];

const PlayerPageSidebar = ({ onFontSizeChange }: { onFontSizeChange: (size: string) => void }) => {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth);
  const [selectedFontSize, setSelectedFontSize] = useState("text-base");

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

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    onFontSizeChange(size);
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
      <section className="flex flex-col h-[100vh] bg-white shadow-md w-64 py-6 px-4">
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
          <div className="mt-6">
  <h3 className="text-sm font-semibold text-gray-600">Font Size</h3>
  <div className="flex gap-2 mt-2">
    <button
      onClick={() => handleFontSizeChange("text-sm")}
      className={cn(
        "px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300",
        {
          "bg-green-500 text-white": selectedFontSize === "text-sm",
        }
      )}
      style={{ fontSize: '0.875rem' }} 
    >
      Aa
    </button>
    <button
      onClick={() => handleFontSizeChange("text-base")}
      className={cn(
        "px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300",
        {
          "bg-green-500 text-white": selectedFontSize === "text-base",
        }
      )}
      style={{ fontSize: '1rem' }} 
    >
      Aa
    </button>
    <button
      onClick={() => handleFontSizeChange("text-lg")}
      className={cn(
        "px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300",
        {
          "bg-green-500 text-white": selectedFontSize === "text-lg",
        }
      )}
      style={{ fontSize: '1.125rem' }}
    >
      Aa
    </button>
    <button
      onClick={() => handleFontSizeChange("text-xl")}
      className={cn(
        "px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300",
        {
          "bg-green-500 text-white": selectedFontSize === "text-xl",
        }
      )}
      style={{ fontSize: '1.25rem' }} 
    >
      Aa
    </button>
  </div>
</div>
        </div>
        <div className="mt-auto">
          {footerLinks.map((link) => renderLink(link, true))}
          <LoginButton user={user} loading={loading} className="mt-4">
            {user ? "Sign Out" : "Login"}
          </LoginButton>
        </div>
      </section>
    </div>
  );
};

export default PlayerPageSidebar;
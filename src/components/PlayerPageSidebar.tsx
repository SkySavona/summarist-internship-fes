"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import LoginButton from "@/components/auth/LoginButton";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebaseConfig";
import { iconMap, sidebarLinks, SidebarLink } from "@/constants/sidebar";

interface PlayerPageSidebarProps {
  onFontSizeChange: (size: string) => void;
}

const PlayerPageSidebar: React.FC<PlayerPageSidebarProps> = ({
  onFontSizeChange,
}) => {
  const pathname = usePathname();
  const [user, loading] = useAuthState(auth!);
  const [selectedFontSize, setSelectedFontSize] = useState("text-base");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
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
          "flex items-center gap-3 py-2 transition-colors duration-300 ease-in-out -mx-4 px-4 hover:bg-gray-200 focus:outline-none ",
          {
            "bg-nav-focus border-l-4 border-green-1": isActive,
          }
        )}
        onClick={() => setIsOpen(false)}
      >
        {Icon && <Icon className="text-xl text-blue-1" />}
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
    <>
      <button
        className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-blue-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
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
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-600">Font Size</h3>
              <div className="flex gap-2 mt-2">
                {["text-sm", "text-base", "text-lg", "text-xl"].map((size) => (
                  <button
                    key={size}
                    onClick={() => handleFontSizeChange(size)}
                    className={cn(
                      "px-2 py-1 bg-gray-200 rounded-md hover:bg-gray-300",
                      {
                        "bg-green-500 text-white": selectedFontSize === size,
                      }
                    )}
                    style={{ fontSize: size === "text-sm" ? "0.875rem" : size === "text-base" ? "1rem" : size === "text-lg" ? "1.125rem" : "1.25rem" }}
                  >
                    Aa
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-auto">
            {footerLinks.map((link) => renderLink(link, true))}
            <LoginButton user={user} loading={loading} className="mt-4">
              {user ? "Sign Out" : "Login"}
            </LoginButton>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PlayerPageSidebar;
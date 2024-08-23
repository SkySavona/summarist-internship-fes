"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { User } from "firebase/auth";
import { auth } from "@/services/firebaseConfig";
import { iconMap, sidebarLinks, SidebarLink } from "@/constants/sidebar";
import AuthModal from "@/components/auth/AuthModal";
import SidebarLoginButton from "@/components/auth/SidebarLoginButton";
import { signOut } from "firebase/auth";

interface SidebarLayoutProps {
  children: React.ReactNode;
}

const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const [showSignInPopup, setShowSignInPopup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth?.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  const handleLoginClick = () => {
    if (user) {
      handleSignOut();
    } else {
      setIsAuthModalOpen(true);
      setIsOpen(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      if (auth) {
        await signOut(auth);
        setShowSignOutPopup(true);
        setTimeout(() => {
          setShowSignOutPopup(false);
        }, 3000);
      } else {
      }
    } catch (error) {
    } finally {
      setIsSigningOut(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthModalOpen(false);
    setShowSignInPopup(true);
    setTimeout(() => {
      setShowSignInPopup(false);
    }, 3000);

    if (pathname === "/") {
      router.push("/for-you");
    }
  };

  const renderLink = ({ route, label, iconName, cursorTo }: SidebarLink) => {
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
      acc[["Settings", "Help & Support"].includes(link.label) ? 1 : 0].push(link);
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
              {mainLinks.map(renderLink)}
            </nav>
          </div>
          <div className="mt-auto">
            {footerLinks.map(renderLink)}
            <SidebarLoginButton
              user={user}
              loading={loading || isSigningOut}
              className="mt-4"
              onClick={handleLoginClick}
            >
              {user ? "Sign Out" : "Login"}
            </SidebarLoginButton>
          </div>
        </div>
      </aside>
      <main className="flex-1 ml-0 lg:ml-64 transition-margin duration-300 ease-in-out relative">
        {children}
      </main>
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      {showSignOutPopup && (
        <div className="fixed bottom-4 right-4 bg-green-1 text-white p-4 rounded-md shadow-lg z-50">
          Successfully signed out!
        </div>
      )}
      {showSignInPopup && (
        <div className="fixed bottom-4 right-4 bg-green-1 text-white p-4 rounded-md shadow-lg z-50">
          Successfully signed in!
        </div>
      )}
    </div>
  );
};

export default SidebarLayout;
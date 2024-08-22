import { AiOutlineHome } from "react-icons/ai";
import { PiBookmarkSimple } from "react-icons/pi";
import { LuPencilLine } from "react-icons/lu";
import { CgSearch } from "react-icons/cg";
import { BsGear } from "react-icons/bs";
import { IoMdHelpCircleOutline } from "react-icons/io";
import { CiLogin } from "react-icons/ci";

export const iconMap = {
  AiOutlineHome,
  PiBookmarkSimple,
  LuPencilLine,
  CgSearch,
  BsGear,
  IoMdHelpCircleOutline,
  CiLogin,
};

export type IconName = keyof typeof iconMap;

export interface SidebarLink {
  iconName: IconName;
  route: string;
  label: string;
  cursorTo: string;
}

export const sidebarLinks: ReadonlyArray<SidebarLink> = [
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
    route: "#",
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
    cursorTo: "pointer",
  },
];
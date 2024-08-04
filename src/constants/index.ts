export const sidebarLinks = [
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
      route: "/",
      label: "Highlights",
      cursorTo: "not-allowed",
    },
    {
      iconName: "CgSearch",
      route: "/",
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
      route: "/",
      label: "Help & Support",
      cursorTo: "not-allowed",
    },

  ] as const;
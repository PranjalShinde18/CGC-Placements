import { GoHomeFill } from "react-icons/go";
import { IconType } from "react-icons";
import { MdOutlineBookmark } from "react-icons/md";
import { TbUserFilled } from "react-icons/tb";
import { BiSolidBriefcase  } from "react-icons/bi";
import { FaLocationArrow } from "react-icons/fa6";


interface Link {
  name: string;
  path: string;
  icon: IconType;
}

export const links: Link[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: GoHomeFill,
  },
  {
    name: "Jobs",
    path: "/jobs",
    icon: BiSolidBriefcase ,
  },
  {
    name: "Track Job",
    path: "/track-jobs",
    icon: FaLocationArrow,
  },
  {
    name: "Bookmark",
    path: "/bookmarks",
    icon: MdOutlineBookmark,
  },
  {
    name: "Profile",
    path: "/profile",
    icon: TbUserFilled,
  },
];

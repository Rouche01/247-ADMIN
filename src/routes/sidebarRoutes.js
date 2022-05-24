import { AiFillHome, AiFillNotification } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { GiSteeringWheel } from "react-icons/gi";
import { BsPlayFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";

export const routes = [
  {
    label: "Overview",
    icon: AiFillHome,
    link: "/overview",
  },
  {
    label: "Campaigns",
    icon: AiFillNotification,
    link: "/campaigns",
  },
  {
    label: "Advertisers",
    icon: HiUsers,
    link: "/advertisers",
  },
  {
    label: "Drivers",
    icon: GiSteeringWheel,
    link: "/drivers",
  },
  {
    label: "Content Library",
    icon: BsPlayFill,
    link: "/content-library",
  },
  {
    label: "Playlist Manager",
    icon: BsPlayFill,
    link: "/playlist-manager",
  },
  {
    label: "Quiz Centre",
    icon: BsPlayFill,
    link: "/quiz-centre",
  },
  {
    label: "Send Notifs",
    icon: RiMessage2Fill,
    link: "/send-notifications",
  },
];

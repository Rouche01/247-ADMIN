import { AiFillHome, AiFillNotification } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { GiSteeringWheel } from "react-icons/gi";
import { BsPlayFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";

export const routes = [
  {
    label: "Overview",
    icon: AiFillHome,
    link: "/overview"
  },
  {
    label: "Advertisers",
    icon: HiUsers,
    link: "/advertisers"
  },
  {
    label: "Drivers",
    icon: GiSteeringWheel,
    link: "/drivers"
  },
  {
    label: "Campaigns",
    icon: AiFillNotification,
    link: "/campaigns"
  },
  {
    label: "Ad Playlists",
    icon: BsPlayFill,
    link: "/ad-playlists"
  },
  {
    label: "Send Notifs",
    icon: RiMessage2Fill,
    link: "/send-notifs"
  },
];

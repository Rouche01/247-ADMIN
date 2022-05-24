import { AiFillHome, AiFillNotification } from "react-icons/ai";
import { HiUsers } from "react-icons/hi";
import { GiSteeringWheel } from "react-icons/gi";
import { BsPlayFill } from "react-icons/bs";
import { RiMessage2Fill } from "react-icons/ri";
import { MdVideoLibrary, MdQuiz } from "react-icons/md";

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
    icon: MdVideoLibrary,
    link: "/content-library",
  },
  {
    label: "Playlist Manager",
    icon: BsPlayFill,
    link: "/playlist-manager",
  },
  {
    label: "Quiz Centre",
    icon: MdQuiz,
    link: "/quiz-centre",
  },
  {
    label: "Send Notifs",
    icon: RiMessage2Fill,
    link: "/send-notifications",
  },
];

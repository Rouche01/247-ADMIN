import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import SearchInput from "../components/uiComponents/SearchInput";
import { routes } from "../routes/sidebarRoutes";
import { MdNotifications } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import Avatar from "../components/uiComponents/Avatar";

const Dashboard = ({ children, pageTitle }) => {
  return (
    <div className="h-screen max-h-screen overflow-y-hidden">
      <div className="grid grid-cols-5 gap-0 max-h-screen h-screen">
        <div className="h-screen min-h-screen border-r-2 border-247-dark-text bg-247-secondary">
          <img src={Logo} alt="logo" width="160" className="ml-10 mt-10" />
          <ul className="ml-10 mt-20">
            {routes.map((route) => (
              <li className="py-5">
                <Link to={route.link}>
                  <span className="flex items-center space-x-6">
                    <route.icon size={22} color="#959698" />
                    <span className="text-247-inactive-link text-xl font-customRoboto">
                      {route.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-4 w-full h-screen min-h-screen bg-247-main px-10 py-10">
          <div className="flex items-center justify-between pb-4">
            <h1 className="text-white font-customRoboto text-3xl font-bold">
              {pageTitle}
            </h1>
            <div className="flex space-x-8 items-center">
              <SearchInput />
              <div className="relative cursor-pointer">
                <MdNotifications color="#979797" size={28} />
                <div className="w-3 h-3 border-2 border-247-main rounded-full bg-red-500 absolute top-0 right-0"></div>
              </div>
              <div className="flex items-center">
                <Avatar />
                <FaAngleDown color="#EBEBEB" className="ml-2 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className="overflow-y-scroll max-h-full scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

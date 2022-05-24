import React, { forwardRef, useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/logo.png";
import SearchInput from "../components/uiComponents/SearchInput";
import { routes } from "../routes/sidebarRoutes";
import { MdNotifications } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import Avatar from "../components/uiComponents/Avatar";
import classNames from "classnames/bind";
import withClickOutside from "../hoc/withClickOutside";
import { Context as AuthContext } from "../context/AuthContext";
import CreateCampaignBtn from "./uiComponents/CreateCampaignBtn";
import CreateCampaignModal from "./uiComponents/CreateCampaignModal";

const Dashboard = forwardRef(({ children, open, setOpen }, ref) => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  const [campaignModalIsOpen, setCampaignModalIsOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(!open);
  };

  return (
    <div className="h-screen max-h-screen overflow-y-hidden">
      <div className="grid grid-cols-5 gap-0 max-h-screen h-screen">
        <div className="h-screen min-h-screen border-r-2 border-247-dark-text bg-247-secondary">
          <img src={Logo} alt="logo" width="160" className="ml-10 mt-10" />
          <ul className="ml-10 mt-20">
            {routes.map((route) => {
              if (location.pathname.includes(route.link)) {
                return (
                  <li className="py-5">
                    <Link to={route.link}>
                      <span className="flex items-center space-x-6">
                        <route.icon size={22} color="#FF0000" />
                        <span className="text-white text-xl font-customRoboto">
                          {route.label}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              } else {
                return (
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
                );
              }
            })}
          </ul>
        </div>
        <div className="col-span-4 w-full h-screen min-h-screen bg-247-main px-10 py-10">
          <div className="flex items-center justify-between pb-4">
            <SearchInput />
            <div className="flex space-x-8 items-center">
              <CreateCampaignBtn
                onBtnClick={() => setCampaignModalIsOpen(true)}
              />
              <div className="relative cursor-pointer">
                <MdNotifications color="#979797" size={28} />
                <div className="w-3 h-3 border-2 border-247-main rounded-full bg-red-500 absolute top-0 right-0"></div>
              </div>
              <div className="flex items-center">
                <Avatar />
                <div className="relative" ref={ref}>
                  <div>
                    <FaAngleDown
                      color="#EBEBEB"
                      className="ml-2 cursor-pointer"
                      onClick={toggleDropdown}
                    />
                  </div>
                  <ul className="absolute top-7 text-right bg-247-secondary border -right-3 border-247-dark-text p-0 transition-all translate-y-3 origin-top-right">
                    <li
                      className={classNames(
                        "list-none",
                        "text-white",
                        "py-2",
                        "px-6",
                        "z-20",
                        { "opacity-0": !open },
                        { "opacity-100": open },
                        { visible: open },
                        { hidden: !open },
                        "cursor-pointer"
                      )}
                      onClick={logout}
                    >
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-y-scroll max-h-full scrollbar-hide">
            {children}
          </div>
        </div>
      </div>
      <CreateCampaignModal
        setIsOpen={setCampaignModalIsOpen}
        modalIsOpen={campaignModalIsOpen}
        modalWidth={704}
      />
    </div>
  );
});

export default withClickOutside(Dashboard);

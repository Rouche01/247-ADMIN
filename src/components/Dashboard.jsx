import React, {
  forwardRef,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import io from "socket.io-client";
import { Toaster } from "react-hot-toast";
import { Link, useLocation } from "react-router-dom";
import { MdAdd } from "react-icons/md";
import { MdNotifications } from "react-icons/md";
import { FaAngleDown } from "react-icons/fa";
import classNames from "classnames/bind";
import debounce from "lodash/debounce";

import Logo from "../assets/logo.png";
import SearchInput from "../components/uiComponents/SearchInput";
import { routes } from "../routes/sidebarRoutes";
import Avatar from "../components/uiComponents/Avatar";
import withClickOutside from "../hoc/withClickOutside";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as CampaignContext } from "../context/CampaignContext";
import { Context as AdvertiserContext } from "../context/AdvertiserContext";
import { Context as DriverContext } from "../context/DriverContext";
import RoundedBtnWithIcon from "./uiComponents/RoundedBtnWithIcon";
import CreateCampaignModal from "./uiComponents/CreateCampaignModal";
import { NOTIFICATION_EVENTS, NOTIFIER_SOCKET_URL } from "../utils/constants";
import { useMemo } from "react";
import SearchResultList from "./SearchResultList";

const Dashboard = forwardRef(
  ({ children, open, setOpen, customHeader, fetchCampaignsFn }, ref) => {
    const location = useLocation();
    const {
      state: { user },
      logout,
    } = useContext(AuthContext);

    const {
      state: { loading: fetchingCampaigns, campaignsWithSearchInput },
      fetchCampaignsWithSearchInput,
    } = useContext(CampaignContext);

    const {
      state: { loading: fetchingAdvertisers, advertisersWithSearchInput },
      fetchAdvertisersWithSearchInput,
    } = useContext(AdvertiserContext);

    const {
      state: { fetchingDrivers, driversWithSearchInput },
      fetchDriversWithSearchInput,
    } = useContext(DriverContext);

    const [globalSearchValue, setGlobalSearchValue] = useState("");

    useEffect(() => {
      const socket = io(NOTIFIER_SOCKET_URL);

      socket.on("connect", () => {
        socket.emit(NOTIFICATION_EVENTS.JOIN, user.id);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const [campaignModalIsOpen, setCampaignModalIsOpen] = useState(false);

    const toggleDropdown = () => {
      setOpen(!open);
    };

    const fetchResourcesWithGlobalSearch = async (value) => {
      const payload = { startsWith: value };
      await Promise.all([
        fetchCampaignsWithSearchInput(payload),
        fetchAdvertisersWithSearchInput(payload),
        fetchDriversWithSearchInput(payload),
      ]);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceGlobalSearchFetch = useCallback(
      debounce((value) => {
        fetchResourcesWithGlobalSearch(value);
      }, 500),
      []
    );

    const handleGlobalSearchInputChange = (val) => {
      setGlobalSearchValue(val);
      debounceGlobalSearchFetch(val);
    };

    const loadingSearch = useMemo(
      () => fetchingAdvertisers || fetchingCampaigns || fetchingDrivers,
      [fetchingAdvertisers, fetchingCampaigns, fetchingDrivers]
    );

    const searchResults = useMemo(() => {
      const transformedDrivers = driversWithSearchInput.map((driver) => ({
        type: "driver",
        name: driver.name,
        recordInfo: {
          phoneNumber: `0${driver.phoneNumber}`,
          email: driver.email,
          city: driver.city,
        },
        id: driver.driverId,
      }));

      const transformedCampaigns = campaignsWithSearchInput.map((campaign) => ({
        type: "campaign",
        campaignName: campaign.campaignName,
        id: campaign.campaignID,
        recordInfo: {
          adType: campaign.adType,
          impressions: `${campaign?.campaignStat?.impressions} impressions`,
          status: campaign.status,
        },
      }));

      const transformedAdvertisers = advertisersWithSearchInput.map(
        (advertiser) => ({
          type: "advertiser",
          advertiserName: advertiser.companyName,
          id: advertiser.advertiserId,
          recordInfo: {
            email: advertiser.email,
          },
        })
      );

      return [
        ...transformedDrivers,
        ...transformedCampaigns,
        ...transformedAdvertisers,
      ];
    }, [
      driversWithSearchInput,
      campaignsWithSearchInput,
      advertisersWithSearchInput,
    ]);

    console.log(searchResults);

    return (
      <div className="h-screen max-h-screen overflow-y-hidden">
        <Toaster position="top-center" />
        <div className="grid grid-cols-5 gap-0 max-h-screen h-screen">
          <div className="overflow-y-scroll scrollbar-hide h-screen min-h-screen border-r-2 border-247-dark-text bg-247-secondary min-w-min">
            <img src={Logo} alt="logo" width="160" className="ml-10 mt-10" />
            <ul className="ml-10 mt-20">
              {routes.map((route) => {
                if (location.pathname.includes(route.link)) {
                  return (
                    <li className="py-5">
                      <Link to={route.link}>
                        <span className="flex items-center space-x-6">
                          <route.icon size={22} color="#FF0000" />
                          <span className="text-white text-xl font-customRoboto whitespace-nowrap">
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
                          <span className="text-247-inactive-link text-xl font-customRoboto whitespace-nowrap">
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
            {customHeader ? (
              customHeader
            ) : (
              <div className="flex items-center justify-between pb-4">
                <SearchInput
                  value={globalSearchValue}
                  handleChange={handleGlobalSearchInputChange}
                  placeholderText="Search Campaigns, Advertisers & Drivers"
                />
                <div className="flex space-x-8 items-center">
                  <RoundedBtnWithIcon
                    onBtnClick={() => setCampaignModalIsOpen(true)}
                    title="Create Campaign"
                    icon={<MdAdd className="mr-2" size={22} />}
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
            )}
            <div className="overflow-y-scroll max-h-full scrollbar-hide">
              {globalSearchValue.length > 0 ? (
                <SearchResultList
                  results={searchResults}
                  loadingResults={globalSearchValue.length > 0 && loadingSearch}
                />
              ) : (
                children
              )}
            </div>
          </div>
        </div>
        <CreateCampaignModal
          setIsOpen={setCampaignModalIsOpen}
          modalIsOpen={campaignModalIsOpen}
          modalWidth={704}
          fetchCallback={fetchCampaignsFn}
        />
      </div>
    );
  }
);

export default withClickOutside(Dashboard);

import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_DRIVERS = "fetching_drivers";
const FETCHING_SINGLE_DRIVER = "fetching_single_driver";
const SET_FETCH_DRIVERS_ERROR = "set_fetch_drivers_error";
const FETCH_SINGLE_DRIVER_ERROR = "fetch_single_driver_error";
const SET_DRIVERS_LIST = "set_drivers_list";
const SET_SINGLE_DRIVER = "set_single_driver";
const SET_DRIVERS_LIST_SIZE = "set_drivers_list_size";

const driverReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_DRIVERS:
      return { ...state, fetchingDrivers: action.payload };
    case FETCHING_SINGLE_DRIVER:
      return { ...state, fetchingSingleDriver: action.payload };
    case FETCH_SINGLE_DRIVER_ERROR:
      return { ...state, fetchSingleDriverError: action.payload };
    case SET_FETCH_DRIVERS_ERROR:
      return { ...state, fetchDriversError: action.payload };
    case SET_SINGLE_DRIVER:
      return { ...state, driver: action.payload };
    case SET_DRIVERS_LIST:
      return { ...state, drivers: action.payload };
    case SET_DRIVERS_LIST_SIZE:
      return { ...state, driverListSize: action.payload };
    default:
      return state;
  }
};

const fetchDrivers = (dispatch) => async (params) => {
  dispatch({ type: FETCHING_DRIVERS, payload: true });
  dispatch({ type: SET_FETCH_DRIVERS_ERROR, payload: null });
  try {
    const response = await adverts247Api.get("/drivers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params,
    });

    dispatch({ type: SET_DRIVERS_LIST, payload: response.data.drivers });
    dispatch({ type: SET_DRIVERS_LIST_SIZE, payload: response.data.size });
    dispatch({ type: FETCHING_DRIVERS, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_DRIVERS_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch drivers. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_DRIVERS_ERROR,
        payload: "Unable to fetch drivers. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_DRIVERS, payload: false });
  }
};

const fetchDriverById = (dispatch) => async (driverId) => {
  dispatch({ type: FETCHING_SINGLE_DRIVER, payload: true });
  dispatch({ type: FETCH_SINGLE_DRIVER_ERROR, payload: null });
  try {
    const response = await adverts247Api.get(`/driver/${driverId}`, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: SET_SINGLE_DRIVER, payload: response.data.driver });
    dispatch({ type: FETCHING_SINGLE_DRIVER, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_SINGLE_DRIVER_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch driver. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_SINGLE_DRIVER_ERROR,
        payload: "Unable to fetch driver. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_SINGLE_DRIVER, payload: false });
  }
};

export const { Context, Provider } = createDataContext(
  driverReducer,
  {
    fetchingDrivers: false,
    fetchingSingleDriver: false,
    drivers: [],
    driver: null,
    fetchDriversError: null,
    fetchSingleDriverError: null,
    driverListSize: 0,
  },
  { fetchDrivers, fetchDriverById }
);

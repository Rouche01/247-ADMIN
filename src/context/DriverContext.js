import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_DRIVERS = "fetching_drivers";
const FETCHING_SINGLE_DRIVER = "fetching_single_driver";
const UPDATING_STATUS = "updating_status";
const SET_FETCH_DRIVERS_ERROR = "set_fetch_drivers_error";
const FETCH_SINGLE_DRIVER_ERROR = "fetch_single_driver_error";
const UPDATE_STATUS_ERROR = "update_status_error";
const SET_DRIVERS_LIST = "set_drivers_list";
const SET_SINGLE_DRIVER = "set_single_driver";
const SET_DRIVERS_LIST_SIZE = "set_drivers_list_size";
const FETCHING_TOTAL_SIZE = "fetching_total_size";
const SET_DRIVERS_TOTAL_SIZE = "set_drivers_total_size";
const UPDATING_ATTRIBUTES = "updating_attributes";
const UPDATE_ATTRIBUTES_SUCCESS = "update_attributes_success";
const UPDATE_ATTRIBUTES_FAIL = "update_attributes_fail";
const SET_DRIVERS_WITH_SEARCH_INPUT = "set_drivers_with_search_input";

const mapErrorDispatchToAction = {
  fetchDrivers: SET_FETCH_DRIVERS_ERROR,
  fetchDriverById: FETCH_SINGLE_DRIVER_ERROR,
  updateStatus: UPDATE_STATUS_ERROR,
  updateAttributes: UPDATE_ATTRIBUTES_FAIL,
};

const driverReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_DRIVERS:
      return { ...state, fetchingDrivers: action.payload };
    case FETCHING_SINGLE_DRIVER:
      return { ...state, fetchingSingleDriver: action.payload };
    case UPDATING_STATUS:
      return { ...state, updatingDriverStatus: action.payload };
    case UPDATE_STATUS_ERROR:
      return { ...state, updateStatusError: action.payload };
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
    case FETCHING_TOTAL_SIZE:
      return { ...state, fetchingTotalSize: action.payload };
    case SET_DRIVERS_TOTAL_SIZE:
      return { ...state, driversTotalSize: action.payload };
    case UPDATING_ATTRIBUTES:
      return { ...state, updatingAttributes: action.payload };
    case UPDATE_ATTRIBUTES_SUCCESS:
      return { ...state, updateAttributesSuccess: action.payload };
    case UPDATE_ATTRIBUTES_FAIL:
      return { ...state, updateAttributesError: action.payload };
    case SET_DRIVERS_WITH_SEARCH_INPUT:
      return { ...state, driversWithSearchInput: action.payload };
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
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
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

const fetchDriversWithSearchInput = (dispatch) => async (params) => {
  dispatch({ type: FETCHING_DRIVERS, payload: true });
  dispatch({ type: SET_FETCH_DRIVERS_ERROR, payload: null });
  try {
    const response = await adverts247Api.get("/drivers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
    });

    dispatch({
      type: SET_DRIVERS_WITH_SEARCH_INPUT,
      payload: response.data.drivers,
    });
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

const getDriversTotalSize = (dispatch) => async () => {
  dispatch({ type: FETCHING_TOTAL_SIZE, payload: true });
  dispatch({ type: SET_FETCH_DRIVERS_ERROR, payload: null });
  try {
    const response = await adverts247Api.get("/drivers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: SET_DRIVERS_TOTAL_SIZE, payload: response.data.size });
    dispatch({ type: FETCHING_TOTAL_SIZE, payload: false });
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
    dispatch({ type: FETCHING_TOTAL_SIZE, payload: false });
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

const updateDriverAttributes = (dispatch) => async (data, driverId, cb) => {
  dispatch({ type: UPDATING_ATTRIBUTES, payload: true });
  dispatch({ type: UPDATE_ATTRIBUTES_FAIL, payload: null });
  try {
    const response = await adverts247Api.patch(`/drivers/${driverId}`, data, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({
      type: UPDATE_ATTRIBUTES_SUCCESS,
      payload: response.data.message,
    });
    dispatch({ type: UPDATING_ATTRIBUTES, payload: false });
    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: UPDATE_ATTRIBUTES_FAIL,
        payload:
          err.response.data.message ||
          "Unable to update driver attributes. Something went wrong",
      });
    } else {
      dispatch({
        type: UPDATE_ATTRIBUTES_FAIL,
        payload: "Unable to update driver attributes. Something went wrong",
      });
    }
    dispatch({ type: UPDATING_ATTRIBUTES, payload: false });
  }
};

const updateDriverStatus = (dispatch) => async (driverId, newStatus, cb) => {
  dispatch({ type: UPDATING_STATUS, payload: true });
  dispatch({ type: UPDATE_STATUS_ERROR, payload: null });
  try {
    const _response = await adverts247Api.patch(
      `/driver/change-status?driver=${driverId}`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${resolveToken()}` } }
    );

    cb && cb();
    dispatch({ type: UPDATING_STATUS, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: UPDATE_STATUS_ERROR,
        payload:
          err.response.data.message ||
          "Unable to update driver status. Something went wrong",
      });
    } else {
      dispatch({
        type: UPDATE_STATUS_ERROR,
        payload: "Unable to update driver status. Something went wrong",
      });
    }
    dispatch({ type: UPDATING_STATUS, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorDispatchToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  driverReducer,
  {
    fetchingDrivers: false,
    fetchingSingleDriver: false,
    updatingDriverStatus: false,
    drivers: [],
    driver: null,
    fetchDriversError: null,
    fetchSingleDriverError: null,
    updateStatusError: null,
    driverListSize: 0,
    fetchingTotalSize: false,
    driversTotalSize: 0,
    updatingAttributes: false,
    updateAttributesError: null,
    updateAttributesSuccess: null,
    driversWithSearchInput: [],
  },
  {
    fetchDrivers,
    fetchDriversWithSearchInput,
    fetchDriverById,
    updateDriverStatus,
    clearError,
    getDriversTotalSize,
    updateDriverAttributes,
  }
);

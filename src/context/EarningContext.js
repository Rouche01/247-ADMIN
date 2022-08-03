import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_LIFETIME_EARNING = "fetching_lifetime_earning";
const SET_LIFETIME_EARNING = "set_lifetime_earning";
const FETCH_LIFETIME_ERROR = "fetch_lifetime_error";
const FETCHING_DAY_EARNING = "fetching_day_earning";
const SET_DAY_EARNING = "set_day_earning";
const FETCH_DAY_EARNING_ERROR = "fetch_day_earning_error";

const earningReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_LIFETIME_EARNING:
      return { ...state, fetchingLifetimeEarning: action.payload };
    case SET_LIFETIME_EARNING:
      return { ...state, lifetimeEarning: action.payload };
    case FETCH_LIFETIME_ERROR:
      return { ...state, fetchLifetimeError: action.payload };
    case FETCHING_DAY_EARNING:
      return { ...state, fetchingDayEarning: action.payload };
    case SET_DAY_EARNING:
      return { ...state, dayEarning: action.payload };
    case FETCH_DAY_EARNING_ERROR:
      return { ...state, fetchDayEarningError: action.payload };
    default:
      return state;
  }
};

const getDriverLifetimeEarning = (dispatch) => async (driverId) => {
  dispatch({ type: FETCHING_LIFETIME_EARNING, payload: true });
  try {
    const response = await adverts247Api.get(`/earnings/${driverId}`, {
      headers: {
        Authorization: `Bearer ${resolveToken()}`,
      },
    });

    dispatch({ type: FETCHING_LIFETIME_EARNING, payload: false });
    dispatch({
      type: SET_LIFETIME_EARNING,
      payload: response.data.totalEarning,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_LIFETIME_ERROR,
        payload:
          err.response.data.message ||
          "Unable to retrieve driver's earnings. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_LIFETIME_ERROR,
        payload: "Unable to retrieve driver's earnings. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_LIFETIME_EARNING, payload: false });
  }
};

const getDriverDayEarning = (dispatch) => async (driverId) => {
  dispatch({ type: FETCHING_DAY_EARNING, payload: true });
  try {
    const response = await adverts247Api.get(`/earnings/${driverId}`, {
      headers: {
        Authorization: `Bearer ${resolveToken()}`,
      },
      params: {
        period: "day",
      },
    });

    dispatch({
      type: SET_DAY_EARNING,
      payload: response.data.totalEarning,
    });
    dispatch({ type: FETCHING_DAY_EARNING, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_DAY_EARNING_ERROR,
        payload:
          err.response.data.message ||
          "Unable to retrieve driver's earnings. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_DAY_EARNING_ERROR,
        payload: "Unable to retrieve driver's earnings. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_DAY_EARNING, payload: false });
  }
};

export const { Context, Provider } = createDataContext(
  earningReducer,
  {
    fetchingLifetimeEarning: false,
    fetchLifetimeError: null,
    lifetimeEarning: 0,
    fetchingDayEarning: false,
    fetchDayEarningError: null,
    dayEarning: 0,
  },
  { getDriverLifetimeEarning, getDriverDayEarning }
);

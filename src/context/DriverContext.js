import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_DRIVERS = "fetching_drivers";
const SET_FETCH_DRIVERS_ERROR = "set_fetch_drivers_error";
const SET_DRIVERS_LIST = "set_drivers_list";
const SET_DRIVERS_LIST_SIZE = "set_drivers_list_size";

const driverReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_DRIVERS:
      return { ...state, loading: action.payload };
    case SET_FETCH_DRIVERS_ERROR:
      return { ...state, fetchDriversError: action.payload };
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

export const { Context, Provider } = createDataContext(
  driverReducer,
  { loading: false, drivers: [], fetchDriversError: null, driverListSize: 0 },
  { fetchDrivers }
);

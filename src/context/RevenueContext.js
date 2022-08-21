import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_REVENUE = "loading_revenue";
const SET_REVENUE = "set_revenue";
const SET_FETCH_REVENUE_ERROR = "set_revenue_error";


const revenueReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_REVENUE:
      return { ...state, fetchingRevenue: action.payload };
    case SET_REVENUE:
      return { ...state, totalRevenue: action.payload };
    case SET_FETCH_REVENUE_ERROR:
      return { ...state, fetchRevenueError: action.payload };
    default:
      return state;
  }
}

const fetchRevenue = dispatch => async (params) => {
  dispatch({ type: FETCHING_REVENUE, payload: true });
  try {
    const response = await adverts247Api.get(
      "/revenue",
      {
        headers: {
          "Authorization": `Bearer ${resolveToken()}`
        },
        params: { ...params }
      }
    );

    dispatch({ type: SET_REVENUE, payload: response.data.totalRevenue });
    dispatch({ type: FETCHING_REVENUE, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_REVENUE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to update the status of the campaign. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_REVENUE_ERROR,
        payload:
          "Unable to update the status of the campaign. Something went wrong",
      });
    }
  }
}

export const { Context, Provider } = createDataContext(
  revenueReducer,
  {
    fetchingRevenue: false,
    totalRevenue: 0,
    fetchRevenueError: null
  },
  {
    fetchRevenue
  });
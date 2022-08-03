import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_PAYOUT_REQUESTS = "fetching_payout_requests";
const SET_PAYOUT_REQUESTS = "set_payout_requests";
const SET_PAYOUT_LIST_SIZE = "set_payout_list_size";
const SET_FETCH_PAYOUTS_ERROR = "set_fetch_payouts_error";
const FETCHING_TOTAL_SETTLED = "fetching_total_settled";
const SET_FETCH_SETTLED_ERROR = "fetch_settled_error";
const SET_TOTAL_SETTLED = "set_total_settled";
const FETCHING_TOTAL_PENDING = "fetching_total_pending";
const SET_FETCH_PENDING_ERROR = "fetch_pending_error";
const SET_TOTAL_PENDING = "set_total_pending";

const payoutReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_PAYOUT_REQUESTS:
      return { ...state, fetchingPayouts: action.payload };
    case SET_PAYOUT_REQUESTS:
      return { ...state, payoutRequests: action.payload };
    case SET_PAYOUT_LIST_SIZE:
      return { ...state, payoutsListSize: action.payload };
    case SET_FETCH_PAYOUTS_ERROR:
      return { ...state, fetchPayoutsError: action.payload };
    case FETCHING_TOTAL_SETTLED:
      return { ...state, fetchingTotalSettled: action.payload };
    case SET_FETCH_SETTLED_ERROR:
      return { ...state, fetchSettledError: action.payload };
    case SET_TOTAL_SETTLED:
      return { ...state, totalSettled: action.payload };
    case FETCHING_TOTAL_PENDING:
      return { ...state, fetchingTotalPending: action.payload };
    case SET_FETCH_PENDING_ERROR:
      return { ...state, fetchPendingError: action.payload };
    case SET_TOTAL_PENDING:
      return { ...state, totalPending: action.payload };
    default:
      return state;
  }
};

const fetchPayoutRequests = (dispatch) => async (params) => {
  dispatch({ type: FETCHING_PAYOUT_REQUESTS, payload: true });
  dispatch({
    type: SET_FETCH_PAYOUTS_ERROR,
    payload: null,
  });

  try {
    const response = await adverts247Api.get("/payouts", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { ...params },
    });

    dispatch({ type: FETCHING_PAYOUT_REQUESTS, payload: false });
    dispatch({ type: SET_PAYOUT_REQUESTS, payload: response.data.payouts });
    dispatch({ type: SET_PAYOUT_LIST_SIZE, payload: response.data.size });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_PAYOUTS_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch payout requests. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_PAYOUTS_ERROR,
        payload: "Unable to fetch payout requests. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_PAYOUT_REQUESTS, payload: false });
  }
};

const getTotalSettledPayouts = (dispatch) => async () => {
  dispatch({ type: FETCHING_TOTAL_SETTLED, payload: true });
  dispatch({
    type: SET_FETCH_SETTLED_ERROR,
    payload: null,
  });

  try {
    const response = await adverts247Api.get("/payouts", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { status: "success" },
    });

    const totalSettled = response.data.payouts
      .map((payout) => payout.amount)
      .reduce((prev, curr) => prev + curr, 0);
    console.log(response.data.payouts);

    dispatch({ type: FETCHING_TOTAL_SETTLED, payload: false });
    dispatch({ type: SET_TOTAL_SETTLED, payload: totalSettled });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_SETTLED_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch payout requests. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_SETTLED_ERROR,
        payload: "Unable to fetch payout requests. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_TOTAL_SETTLED, payload: false });
  }
};

const getTotalPendingPayouts = (dispatch) => async () => {
  dispatch({ type: FETCHING_TOTAL_PENDING, payload: true });
  dispatch({
    type: SET_FETCH_PENDING_ERROR,
    payload: null,
  });

  try {
    const response = await adverts247Api.get("/payouts", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { status: "pending" },
    });

    const totalPending = response.data.payouts
      .map((payout) => payout.amount)
      .reduce((prev, curr) => prev + curr, 0);

    dispatch({ type: FETCHING_TOTAL_PENDING, payload: false });
    dispatch({ type: SET_TOTAL_PENDING, payload: totalPending });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_PENDING_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch payout requests. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_PENDING_ERROR,
        payload: "Unable to fetch payout requests. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_TOTAL_PENDING, payload: false });
  }
};

export const { Context, Provider } = createDataContext(
  payoutReducer,
  {
    fetchingPayouts: false,
    payoutRequests: [],
    payoutsListSize: 0,
    fetchPayoutsError: null,
    fetchingTotalSettled: false,
    totalSettled: 0,
    fetchSettledError: null,
    fetchingTotalPending: false,
    totalPending: 0,
    fetchPendingError: null,
  },
  { fetchPayoutRequests, getTotalSettledPayouts, getTotalPendingPayouts }
);

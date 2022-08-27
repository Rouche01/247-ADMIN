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
const SETTLING_SINGLE_PAYOUT = "settling_single_payout";
const SINGLE_PAYOUT_SUCCESS = "single_payout_success";
const SINGLE_PAYOUT_FAIL = "single_payout_fail";
const SETTLING_BULK_PAYOUT = "settling_bulk_payout";
const BULK_PAYOUT_SUCCESS = "bulk_payout_success";
const BULK_PAYOUT_FAIL = "bulk_payout_fail";

const mapErrorDispatchToAction = {
  fetchRequests: SET_FETCH_PAYOUTS_ERROR,
  settleBulk: BULK_PAYOUT_FAIL,
  settleSingle: SINGLE_PAYOUT_FAIL,
  fetchTotalSettled: SET_FETCH_SETTLED_ERROR,
  fetchTotalPending: SET_FETCH_PENDING_ERROR,
};

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
    case SETTLING_SINGLE_PAYOUT:
      return { ...state, settlingSinglePayout: action.payload };
    case SINGLE_PAYOUT_FAIL:
      return { ...state, singlePayoutError: action.payload };
    case SINGLE_PAYOUT_SUCCESS:
      return { ...state, singlePayoutSuccess: action.payload };
    case SETTLING_BULK_PAYOUT:
      return { ...state, settlingBulkPayout: action.payload };
    case BULK_PAYOUT_FAIL:
      return { ...state, bulkPayoutError: action.payload };
    case BULK_PAYOUT_SUCCESS:
      return { ...state, bulkPayoutSuccess: action.payload };
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
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
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

const settleBulkPayoutRequest = (dispatch) => async (payoutList, cb) => {
  dispatch({ type: SETTLING_BULK_PAYOUT, payload: true });
  dispatch({ type: BULK_PAYOUT_FAIL, payload: null });
  try {
    const response = await adverts247Api.post(
      "/payouts/settle/bulk",
      { requests: payoutList },
      { headers: { Authorization: `Bearer ${resolveToken()}` } }
    );

    console.log(response.data);
    dispatch({ type: BULK_PAYOUT_SUCCESS, payload: response.data.message });
    dispatch({ type: SETTLING_BULK_PAYOUT, payload: false });

    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: BULK_PAYOUT_FAIL,
        payload:
          err.response.data.message ||
          "Unable to settle bulk payout requests. Something went wrong",
      });
    } else {
      dispatch({
        type: BULK_PAYOUT_FAIL,
        payload: "Unable to settle bulk payout requests. Something went wrong",
      });
    }
    dispatch({ type: SETTLING_BULK_PAYOUT, payload: false });
  }
};

const settleSinglePayoutRequest =
  (dispatch) => async (payoutData, requestId, cb) => {
    dispatch({ type: SETTLING_SINGLE_PAYOUT, payload: true });
    dispatch({ type: SINGLE_PAYOUT_FAIL, payload: null });
    try {
      const response = await adverts247Api.post("/payouts/settle", payoutData, {
        headers: { Authorization: `Bearer ${resolveToken()}` },
        params: { requestId },
      });

      console.log(response.data);
      dispatch({ type: SINGLE_PAYOUT_SUCCESS, payload: response.data.message });
      dispatch({ type: SETTLING_SINGLE_PAYOUT, payload: false });
      cb && cb();
    } catch (err) {
      if (err.response) {
        dispatch({
          type: SINGLE_PAYOUT_FAIL,
          payload:
            err.response.data.message ||
            "Unable to settle payout request. Something went wrong",
        });
      } else {
        dispatch({
          type: SINGLE_PAYOUT_FAIL,
          payload: "Unable to settle payout request. Something went wrong",
        });
      }
      dispatch({ type: SETTLING_SINGLE_PAYOUT, payload: false });
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

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorDispatchToAction[actionType], payload: null });
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
    settlingSinglePayout: false,
    singlePayoutSuccess: null,
    singlePayoutError: null,
    settlingBulkPayout: false,
    bulkPayoutSuccess: null,
    bulkPayoutError: null,
  },
  {
    fetchPayoutRequests,
    getTotalSettledPayouts,
    getTotalPendingPayouts,
    settleSinglePayoutRequest,
    settleBulkPayoutRequest,
    clearError,
  }
);

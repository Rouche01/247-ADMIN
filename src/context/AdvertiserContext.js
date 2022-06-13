import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const SET_LOADING_STATE = "set_loading_state";
const SET_FILTER_LOADING_STATE = "set_filter_loading_state";
const SET_FETCH_ERROR = "set_fetch_error";
const SET_FETCH_BY_ID_ERROR = "set_fetch_by_id_error";
const SET_FILTER_ERROR = "set_filter_error";
const SET_ADVERTISER_LIST = "set_advertiser_list";
const SET_ADVERTISER_SIZE = "set_advertiser_size";
const SET_SINGLE_ADVERTISER = "set_single_advertiser";
const SET_FILTERED_ADVERTISER = "set_filtered_advertiser";

const mapErrorToAction = {
  fetch: SET_FETCH_ERROR,
  fetchById: SET_FETCH_BY_ID_ERROR,
  filterAdvertiser: SET_FILTER_ERROR,
};

const advertiserReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING_STATE:
      return { ...state, loading: action.payload };
    case SET_FILTER_LOADING_STATE:
      return { ...state, filteringAdvertisers: action.payload };
    case SET_FETCH_ERROR:
      return { ...state, fetchError: action.payload };
    case SET_FETCH_BY_ID_ERROR:
      return { ...state, fetchByIdError: action.payload };
    case SET_FILTER_ERROR:
      return { ...state, fetchFilteredError: action.payload };
    case SET_ADVERTISER_LIST:
      return { ...state, advertisers: action.payload };
    case SET_ADVERTISER_SIZE:
      return { ...state, advertiserSize: action.payload };
    case SET_SINGLE_ADVERTISER:
      return { ...state, advertiser: action.payload };
    case SET_FILTERED_ADVERTISER:
      return { ...state, filteredAdvertisers: action.payload };
    default:
      return state;
  }
};

const fetchAdvertisers = (dispatch) => async (params) => {
  dispatch({ type: SET_LOADING_STATE, payload: true });
  dispatch({ type: SET_FETCH_ERROR, payload: null });
  dispatch({ type: SET_ADVERTISER_LIST, payload: [] });
  try {
    const response = await adverts247Api.get("/advertisers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params,
    });

    dispatch({ type: SET_ADVERTISER_LIST, payload: response.data.advertisers });
    dispatch({ type: SET_ADVERTISER_SIZE, payload: response.data.size });
    dispatch({ type: SET_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch advertisers. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_ERROR,
        payload: "Unable to fetch advertisers. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const filterAdvertisersByStartsWith = (dispatch) => async (startsWith) => {
  dispatch({ type: SET_FILTER_LOADING_STATE, payload: true });
  dispatch({ type: SET_FILTER_ERROR, payload: null });
  dispatch({ type: SET_FILTERED_ADVERTISER, payload: [] });
  try {
    const response = await adverts247Api.get(
      `/advertisers/${startsWith ? `?startsWith=${startsWith}` : ""}`,
      {
        headers: { Authorization: `Bearer ${resolveToken()}` },
      }
    );

    dispatch({
      type: SET_FILTERED_ADVERTISER,
      payload: response.data.advertisers,
    });
    dispatch({ type: SET_FILTER_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FILTER_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch advertisers. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FILTER_ERROR,
        payload: "Unable to fetch advertisers. Something went wrong",
      });
    }
    dispatch({ type: SET_FILTER_LOADING_STATE, payload: false });
  }
};

const fetchAdvertiserById = (dispatch) => async (advertiserId) => {
  console.log(advertiserId);
  dispatch({ type: SET_LOADING_STATE, payload: true });
  dispatch({ type: SET_FETCH_BY_ID_ERROR, payload: null });

  try {
    const response = await adverts247Api.get(`/advertisers/${advertiserId}`, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: SET_SINGLE_ADVERTISER, payload: response.data });
    dispatch({ type: SET_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_BY_ID_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch particular advertiser. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_BY_ID_ERROR,
        payload: "Unable to fetch particular advertiser. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  advertiserReducer,
  {
    loading: false,
    filteringAdvertisers: false,
    fetchError: null,
    fetchByIdError: null,
    fetchFilteredError: null,
    advertisers: [],
    advertiserSize: 0,
    advertiser: null,
    filteredAdvertisers: [],
  },
  {
    fetchAdvertisers,
    fetchAdvertiserById,
    clearError,
    filterAdvertisersByStartsWith,
  }
);

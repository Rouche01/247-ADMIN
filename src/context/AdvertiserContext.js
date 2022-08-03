import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const SET_LOADING_STATE = "set_loading_state";
const CREATING_ADVERTISER = "creating_advertiser";
const SET_CREATE_ERROR = "set_create_error";
const SET_FETCH_ERROR = "set_fetch_error";
const SET_FETCH_BY_ID_ERROR = "set_fetch_by_id_error";
const SET_ADVERTISER_LIST = "set_advertiser_list";
const SET_ADVERTISER_SIZE = "set_advertiser_size";
const SET_SINGLE_ADVERTISER = "set_single_advertiser";
const FETCHING_TOTAL_SIZE = "fetching_total_size";
const SET_TOTAL_SIZE = "set_total_size";

const mapErrorToAction = {
  fetch: SET_FETCH_ERROR,
  fetchById: SET_FETCH_BY_ID_ERROR,
  createAdvertiser: SET_CREATE_ERROR,
};

const advertiserReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING_STATE:
      return { ...state, loading: action.payload };
    case SET_FETCH_ERROR:
      return { ...state, fetchError: action.payload };
    case SET_FETCH_BY_ID_ERROR:
      return { ...state, fetchByIdError: action.payload };
    case SET_ADVERTISER_LIST:
      return { ...state, advertisers: action.payload };
    case SET_ADVERTISER_SIZE:
      return { ...state, advertiserSize: action.payload };
    case SET_SINGLE_ADVERTISER:
      return { ...state, advertiser: action.payload };
    case CREATING_ADVERTISER:
      return { ...state, creatingAdvertiser: action.payload };
    case SET_CREATE_ERROR:
      return { ...state, createAdvertiserError: action.payload };
    case FETCHING_TOTAL_SIZE:
      return { ...state, fetchingTotalSize: action.payload };
    case SET_TOTAL_SIZE:
      return { ...state, advertiserTotalSize: action.payload };
    default:
      return state;
  }
};

const createAdvertiser = (dispatch) => async (createData) => {
  dispatch({ type: CREATING_ADVERTISER, payload: true });
  dispatch({ type: SET_CREATE_ERROR, payload: null });

  try {
    const response = await adverts247Api.post("/advertisers", createData, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    console.log(response.data);
    dispatch({ type: CREATING_ADVERTISER, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_CREATE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create advertiser. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_CREATE_ERROR,
        payload: "Unable to create advertiser. Something went wrong",
      });
    }
    dispatch({ type: CREATING_ADVERTISER, payload: false });
  }
};

const fetchAdvertisers = (dispatch) => async (params) => {
  dispatch({ type: SET_LOADING_STATE, payload: true });
  dispatch({ type: SET_FETCH_ERROR, payload: null });
  dispatch({ type: SET_ADVERTISER_LIST, payload: [] });
  try {
    const response = await adverts247Api.get("/advertisers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
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

const fetchTotalAdvertisersSize = (dispatch) => async () => {
  dispatch({ type: FETCHING_TOTAL_SIZE, payload: true });
  dispatch({ type: SET_FETCH_ERROR, payload: null });
  try {
    const response = await adverts247Api.get("/advertisers", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: SET_TOTAL_SIZE, payload: response.data.size });
    dispatch({ type: FETCHING_TOTAL_SIZE, payload: false });
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
    dispatch({ type: FETCHING_TOTAL_SIZE, payload: false });
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
    creatingAdvertiser: false,
    fetchError: null,
    fetchByIdError: null,
    createAdvertiserError: null,
    advertisers: [],
    advertiserSize: 0,
    advertiser: null,
    advertiserTotalSize: 0,
    fetchingTotalSize: false
  },
  {
    fetchAdvertisers,
    fetchAdvertiserById,
    fetchTotalAdvertisersSize,
    createAdvertiser,
    clearError,
  }
);

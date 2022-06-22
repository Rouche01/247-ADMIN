import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const SET_LOADING_STATE = "set_loading_state";
const SET_CREATE_ERROR = "set_create_error_message";
const SET_RETRIEVE_ERROR = "set_retrieve_error_message";
const SET_FETCH_BY_ID_ERROR = "set_fetch_by_id_error";
const SET_CAMPAIGN_LIST = "set_campaign_list";
const SET_CAMPAIGN_SIZE = "set_campaign_size";
const SET_SINGLE_CAMPAIGN = "set_single_campaign";

const mapErrorToAction = {
  fetch: SET_RETRIEVE_ERROR,
  create: SET_CREATE_ERROR,
  fetchById: SET_FETCH_BY_ID_ERROR,
};

const campaignReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING_STATE:
      return { ...state, loading: action.payload };
    case SET_CREATE_ERROR:
      return { ...state, createErrorMsg: action.payload };
    case SET_RETRIEVE_ERROR:
      return { ...state, retrieveErrorMsg: action.payload };
    case SET_FETCH_BY_ID_ERROR:
      return { ...state, fetchByIdError: action.payload };
    case SET_CAMPAIGN_LIST:
      return { ...state, campaigns: action.payload };
    case SET_CAMPAIGN_SIZE:
      return { ...state, campaignSize: action.payload };
    case SET_SINGLE_CAMPAIGN:
      return { ...state, campaign: action.payload };
    default:
      return state;
  }
};

const createCampaign = (dispatch) => async (createCampaignData, cb) => {
  dispatch({ type: SET_LOADING_STATE, payload: true });
  try {
    await adverts247Api.post("/campaigns", createCampaignData, {
      headers: {
        Authorization: `Bearer ${resolveToken()}`,
        "content-type": "multipart/form-data",
      },
    });
    dispatch({ type: SET_LOADING_STATE, payload: false });
    cb && cb();
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      dispatch({
        type: SET_CREATE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create campaign. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_CREATE_ERROR,
        payload: "Unable to create campaign. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const fetchCampaigns = (dispatch) => async (params) => {
  dispatch({ type: SET_RETRIEVE_ERROR, payload: null });
  dispatch({ type: SET_LOADING_STATE, payload: true });
  try {
    const response = await adverts247Api.get("/campaigns", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
    });

    dispatch({ type: SET_CAMPAIGN_LIST, payload: response.data.campaigns });
    dispatch({ type: SET_CAMPAIGN_SIZE, payload: response.data.size });
    dispatch({ type: SET_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      dispatch({
        type: SET_RETRIEVE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create campaign. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_RETRIEVE_ERROR,
        payload: "Unable to create campaign. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const fetchCampaignById = (dispatch) => async (campaignId) => {
  dispatch({ type: SET_FETCH_BY_ID_ERROR, payload: null });
  dispatch({ type: SET_LOADING_STATE, payload: true });
  try {
    const response = await adverts247Api.get(`/campaigns/${campaignId}`, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: SET_SINGLE_CAMPAIGN, payload: response.data });
    dispatch({ type: SET_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: SET_FETCH_BY_ID_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create campaign. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_FETCH_BY_ID_ERROR,
        payload: "Unable to create campaign. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  campaignReducer,
  {
    loading: false,
    campaigns: [],
    campaign: null,
    createErrorMsg: null,
    retrieveErrorMsg: null,
    fetchByIdError: null,
    campaignSize: 0,
  },
  { createCampaign, fetchCampaigns, fetchCampaignById, clearError }
);

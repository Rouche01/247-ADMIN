import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const SET_LOADING_STATE = "set_loading_state";
const SET_ERROR_MESSAGE = "set_error_message";

const campaignReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING_STATE:
      return { ...state, loading: action.payload };
    case SET_ERROR_MESSAGE:
      return { ...state, errorMessage: action.payload };
    default:
      return state;
  }
};

const createCampaign = (dispatch) => async (createCampaignData) => {
  dispatch({ type: SET_LOADING_STATE, payload: true });
  try {
    await adverts247Api.post("/campaigns", createCampaignData, {
      headers: {
        Authorization: `Bearer ${resolveToken()}`,
        "content-type": "multipart/form-data",
      },
    });
    dispatch({ type: SET_LOADING_STATE, payload: false });
  } catch (err) {
    if (err.response) {
      console.log(err.response.data);
      dispatch({
        type: SET_ERROR_MESSAGE,
        payload:
          err.response.data.message ||
          "Unable to create campaign. Something went wrong",
      });
    } else {
      dispatch({
        type: SET_ERROR_MESSAGE,
        payload: "Unable to create campaign. Something went wrong",
      });
    }
    dispatch({ type: SET_LOADING_STATE, payload: false });
  }
};

const clearError = (dispatch) => () => {
  dispatch({ type: SET_ERROR_MESSAGE, payload: null });
};

export const { Context, Provider } = createDataContext(
  campaignReducer,
  { loading: false, campaigns: [], errorMessage: null },
  { createCampaign, clearError }
);

import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const CREATING_CONTENT = "creating_content";
const FETCHING_ITEMS = "fetching_media_items";
const FETCH_ITEMS_ERROR = "fetch_media_items_error";
const CREATE_ERROR = "create_error";
const SET_MEDIA_ITEMS = "set_media_items";
const SET_MEDIA_ITEMS_SIZE = "set_media_items_size";

const mapErrorDispatchToAction = {
  create: CREATE_ERROR,
  fetchItems: FETCH_ITEMS_ERROR,
  // fetchSingle:
};

const contentLibraryReducer = (state, action) => {
  switch (action.type) {
    case CREATING_CONTENT:
      return { ...state, creatingContent: action.payload };
    case CREATE_ERROR:
      return { ...state, createError: action.payload };
    case FETCHING_ITEMS:
      return { ...state, fetchingMediaItems: action.payload };
    case FETCH_ITEMS_ERROR:
      return { ...state, fetchItemsError: action.payload };
    case SET_MEDIA_ITEMS:
      return { ...state, mediaItems: action.payload };
    case SET_MEDIA_ITEMS_SIZE:
      return { ...state, mediaItemsSize: action.payload };
    default:
      return state;
  }
};

const createContentItem = (dispatch) => async (createData, cb) => {
  dispatch({ type: CREATING_CONTENT, payload: true });
  dispatch({ type: CREATE_ERROR, payload: null });
  try {
    await adverts247Api.post("/mediaitems", createData, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: CREATING_CONTENT, payload: false });
    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: CREATE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create content. Something went wrong",
      });
    } else {
      dispatch({
        type: CREATE_ERROR,
        payload: "Unable to create content. Something went wrong",
      });
    }
    dispatch({ type: CREATING_CONTENT, payload: false });
  }
};

const fetchMediaItems = (dispatch) => async (params) => {
  dispatch({ type: FETCHING_ITEMS, payload: true });
  dispatch({ type: FETCH_ITEMS_ERROR, payload: null });

  try {
    const response = await adverts247Api.get("/mediaitems", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params,
    });

    dispatch({ type: SET_MEDIA_ITEMS, payload: response.data.mediaItems });
    dispatch({ type: SET_MEDIA_ITEMS_SIZE, payload: response.data.size });
    dispatch({ type: FETCHING_ITEMS, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_ITEMS_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch media items. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_ITEMS_ERROR,
        payload: "Unable to fetch media items. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_ITEMS, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorDispatchToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  contentLibraryReducer,
  {
    creatingContent: false,
    createError: null,
    fetchingMediaItems: false,
    fetchItemsError: null,
    mediaItems: [],
    mediaItemsSize: 0,
  },
  { createContentItem, fetchMediaItems, clearError }
);

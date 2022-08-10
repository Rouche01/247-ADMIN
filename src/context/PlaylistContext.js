import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const FETCHING_GENERAL_PLAYLIST = "fetching_general_playlist";
const SET_GENERAL_PLAYLIST = "set_general_playlist";
const FETCH_GENERAL_PLAYLIST_ERR = "fetch_general_playlist_error";
const ADDING_PLAYLIST_ITEM = "adding_playlist_item";
const PLAYLIST_ADD_SUCCESS = "playlist_add_success";
const PLAYLIST_ADD_ERROR = "playlist_add_error";
const DELETING_PLAYLIST_ITEM = "deleting_playlist_item";
const PLAYLIST_DELETE_SUCCESS = "playlist_delete_success";
const PLAYLIST_DELETE_ERROR = "playlist_delete_error";
const ADDING_MULTIPLE_ITEM = "adding_multiple_item";
const ADD_MULTIPLE_SUCCESS = "add_multiple_success";
const ADD_MULTIPLE_ERROR = "add_multiple_error";

const mapErrorDispatchToAction = {
  fetchGeneral: FETCH_GENERAL_PLAYLIST_ERR,
  addToPlaylist: PLAYLIST_ADD_ERROR,
  addMultiple: ADD_MULTIPLE_ERROR,
  deleteItem: PLAYLIST_DELETE_ERROR,
};

const playlistReducer = (state, action) => {
  switch (action.type) {
    case FETCHING_GENERAL_PLAYLIST:
      return { ...state, fetchingGeneralPlaylist: action.payload };
    case SET_GENERAL_PLAYLIST:
      return { ...state, generalPlaylist: action.payload };
    case FETCH_GENERAL_PLAYLIST_ERR:
      return { ...state, fetchGeneralPlaylistErr: action.payload };
    case ADDING_PLAYLIST_ITEM:
      return { ...state, addingItemToPlaylist: action.payload };
    case PLAYLIST_ADD_SUCCESS:
      return { ...state, playlistAddedSuccess: action.payload };
    case PLAYLIST_ADD_ERROR:
      return { ...state, playlistAddedFail: action.payload };
    case DELETING_PLAYLIST_ITEM:
      return { ...state, deletePlaylistItem: action.payload };
    case PLAYLIST_DELETE_SUCCESS:
      return { ...state, playlistDeleteSuccess: action.payload };
    case PLAYLIST_DELETE_ERROR:
      return { ...state, playlistDeleteError: action.payload };
    case ADDING_MULTIPLE_ITEM:
      return { ...state, addingMultipleItem: action.payload };
    case ADD_MULTIPLE_SUCCESS:
      return { ...state, addMultipleItemSuccess: action.payload };
    case ADD_MULTIPLE_ERROR:
      return { ...state, addMultipleItemError: action.payload };
    default:
      return state;
  }
};

const fetchGeneralPlaylist = (dispatch) => async () => {
  dispatch({ type: FETCHING_GENERAL_PLAYLIST, payload: true });
  dispatch({
    type: FETCH_GENERAL_PLAYLIST_ERR,
    payload: null,
  });
  try {
    const response = await adverts247Api.get("/playlists", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { name: "general" },
    });

    console.log(response.data.playlist);
    dispatch({ type: FETCHING_GENERAL_PLAYLIST, payload: false });
    dispatch({
      type: SET_GENERAL_PLAYLIST,
      payload: response.data.playlist.queue,
    });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_GENERAL_PLAYLIST_ERR,
        payload:
          err.response.data.message ||
          "Unable to fetch playlist. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_GENERAL_PLAYLIST_ERR,
        payload: "Unable to fetch playlist. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_GENERAL_PLAYLIST, payload: false });
  }
};

const addMultipleItemToPlaylist = (dispatch) => async (data, cb) => {
  dispatch({ type: ADDING_MULTIPLE_ITEM, payload: true });
  dispatch({ type: ADD_MULTIPLE_ERROR, payload: null });
  try {
    const response = await adverts247Api.post(
      "/playlists/item/multiple",
      data,
      { headers: { Authorization: `Bearer ${resolveToken()}` } }
    );

    console.log(response.data);
    dispatch({ type: ADDING_MULTIPLE_ITEM, payload: false });
    dispatch({ type: ADD_MULTIPLE_SUCCESS, payload: response.data.message });
    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: ADD_MULTIPLE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to add items to playlist. Something went wrong",
      });
    } else {
      dispatch({
        type: ADD_MULTIPLE_ERROR,
        payload: "Unable to add items to playlist. Something went wrong",
      });
    }
    dispatch({ type: ADDING_MULTIPLE_ITEM, payload: false });
  }
};

const addItemToPlaylist = (dispatch) => async (data, cb) => {
  dispatch({ type: ADDING_PLAYLIST_ITEM, payload: true });
  dispatch({
    type: PLAYLIST_ADD_ERROR,
    payload: null,
  });
  try {
    const response = await adverts247Api.post("/playlists/item", data, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    console.log(response.data.message);

    dispatch({ type: ADDING_PLAYLIST_ITEM, payload: false });
    dispatch({ type: PLAYLIST_ADD_SUCCESS, payload: response.data.message });

    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: PLAYLIST_ADD_ERROR,
        payload:
          err.response.data.message ||
          "Unable to add item to playlist. Something went wrong",
      });
    } else {
      dispatch({
        type: PLAYLIST_ADD_ERROR,
        payload: "Unable to add item to playlist. Something went wrong",
      });
    }
    dispatch({ type: ADDING_PLAYLIST_ITEM, payload: false });
  }
};

const deletePlaylistItem = (dispatch) => async (playlistId, cb) => {
  dispatch({ type: DELETING_PLAYLIST_ITEM, payload: true });
  dispatch({ type: PLAYLIST_DELETE_ERROR, payload: null });
  try {
    const response = await adverts247Api.delete(
      `/playlists/item/${playlistId}`,
      { headers: { Authorization: `Bearer ${resolveToken()}` } }
    );

    console.log(response.data);
    dispatch({ type: DELETING_PLAYLIST_ITEM, payload: false });
    dispatch({ type: PLAYLIST_DELETE_SUCCESS, payload: response.data.message });
    cb && cb();
  } catch (err) {
    if (err.response) {
      console.log(err.response);
      dispatch({
        type: PLAYLIST_DELETE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to delete playlist item. Something went wrong",
      });
    } else {
      dispatch({
        type: PLAYLIST_DELETE_ERROR,
        payload: "Unable to delete playlist item. Something went wrong",
      });
    }
    dispatch({ type: DELETING_PLAYLIST_ITEM, payload: false });
  }
};

const deletePlaylistItemForMedia = (dispatch) => async (mediaId, cb) => {
  dispatch({ type: DELETING_PLAYLIST_ITEM, payload: true });
  dispatch({ type: PLAYLIST_DELETE_ERROR, payload: null });
  try {
    const response = await adverts247Api.delete(`/playlists/media/${mediaId}`, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: DELETING_PLAYLIST_ITEM, payload: false });
    dispatch({ type: PLAYLIST_DELETE_SUCCESS, payload: response.data.message });
    cb && cb();
  } catch (err) {
    if (err.response) {
      console.log(err.response);
      dispatch({
        type: PLAYLIST_DELETE_ERROR,
        payload:
          err.response.data.message ||
          "Unable to delete playlist item. Something went wrong",
      });
    } else {
      dispatch({
        type: PLAYLIST_DELETE_ERROR,
        payload: "Unable to delete playlist item. Something went wrong",
      });
    }
    dispatch({ type: DELETING_PLAYLIST_ITEM, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorDispatchToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  playlistReducer,
  {
    fetchingGeneralPlaylist: false,
    generalPlaylist: [],
    fetchGeneralPlaylistErr: null,
    addingItemToPlaylist: false,
    playlistAddedSuccess: null,
    playlistAddedFail: null,
    deletingPlaylistItem: false,
    playlistDeleteSuccess: null,
    playlistDeleteError: null,
    addingMultipleItem: false,
    addMultipleItemError: null,
    addMultipleItemSuccess: null,
  },
  {
    fetchGeneralPlaylist,
    addItemToPlaylist,
    clearError,
    deletePlaylistItem,
    deletePlaylistItemForMedia,
    addMultipleItemToPlaylist,
  }
);

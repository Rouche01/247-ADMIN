import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const CREATING_CONTENT = "creating_content";
const CREATE_ERROR = "create_error";

const contentLibraryReducer = (state, action) => {
  switch (action.type) {
    case CREATING_CONTENT:
      return { ...state, creatingContent: action.payload };
    case CREATE_ERROR:
      return { ...state, createError: action.payload };
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
      console.log(err.response.data);
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

export const { Context, Provider } = createDataContext(
  contentLibraryReducer,
  { creatingContent: false, createError: null },
  { createContentItem }
);

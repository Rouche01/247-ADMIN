import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import history from "../utils/history";
import { LOGIN_PAGE } from "../routes/pageUrls";

const authReducer = (state, action) => {
  switch (action.type) {
    case "set_loading":
      return { ...state, loading: action.payload };
    case "signin":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loggedIn: true,
      };
    case "signout":
      return {
        ...state,
        token: null,
        user: null,
        loggedIn: false,
      };
    case "set_error":
      return { ...state, error: action.payload };
    case "clear_error":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const loginAdmin =
  (dispatch) =>
  async ({ email, password }, redirectPath) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const response = await adverts247Api.post("/admin/signin", {
        email,
        password,
      });

      const token = response.data.token;
      dispatch({
        type: "signin",
        payload: { token, user: response.data.user },
      });
      history.push(redirectPath);
    } catch (err) {
      if (err.response) {
        dispatch({
          type: "set_error",
          payload: err.response.data.error,
        });
      } else {
        dispatch({
          type: "set_error",
          payload: "Something went wrong",
        });
      }
    }
    dispatch({ type: "set_loading", payload: false });
  };

const logout = (dispatch) => () => {
  localStorage.removeItem("247auth");
  dispatch({ type: "signout" });
  history.push(LOGIN_PAGE);
};

const clearError = (dispatch) => () => {
  dispatch({
    type: "clear_error",
    payload: null,
  });
};

const storeLocalData = (state) => {
  const { user, loggedIn, token } = state;
  const authData = { user, loggedIn, token };
  localStorage.setItem("247auth", JSON.stringify(authData));
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { loading: false, token: null, user: null, loggedIn: false, error: null },
  { loginAdmin, clearError, logout },
  true,
  storeLocalData
);

import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import history from "../utils/history";
import { OVERVIEW_PAGE } from "../routes/pageUrls";

const authReducer = (state, action) => {
  switch (action.type) {
    case "set_loading":
      console.log(action.payload, "--- in dispatch ---");
      return { loading: action.payload, ...state };
    case "signin":
      return {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        loggedIn: true,
      };
    case "set_error":
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const loginAdmin =
  (dispatch) =>
  async ({ email, password }) => {
    dispatch({ type: "set_loading", payload: true });
    try {
      const response = await adverts247Api.post("/admin/signin", {
        email,
        password,
      });
      console.log(response);
      const token = response.data.token;
      dispatch({
        type: "signin",
        payload: { token, user: response.data.user },
      });
      dispatch({ type: "set_loading", payload: false });
        history.push(OVERVIEW_PAGE);
    } catch (err) {
      dispatch({ type: "set_loading", payload: false });
      console.log(err.response);
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
  };

const storeLocalData = (state) => {
  const { user, loggedIn, token } = state;
  const authData = { user, loggedIn, token };
  localStorage.setItem("247auth", JSON.stringify(authData));
};

export const { Context, Provider } = createDataContext(
  authReducer,
  { loading: false, token: null, user: null, loggedIn: false, error: null },
  { loginAdmin },
  true,
  storeLocalData
);

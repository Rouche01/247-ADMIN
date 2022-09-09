import createDataContext from "./createDataContext";
import adverts247Api from "../apiService/adverts247Api";
import { resolveToken } from "../utils/resolveToken";

const CREATING_QUIZ = "creating_quiz";
const FETCHING_QUIZ = "fetching_quiz";
const DELETING_QUIZ = "deleting_quiz";
const FETCH_QUIZZES_ERROR = "fetch_quizzes_error";
const DELETE_QUIZ_ERROR = "delete_quiz_error";
const SET_QUIZZES = "set_quizzes";
const SET_QUIZZES_COUNT = "set_quizzes_count";
const CREATE_QUIZ_ERROR = "create_quiz_error";

const mapErrorDispatchToAction = {
  createQuiz: CREATE_QUIZ_ERROR,
  fetchQuizzes: FETCH_QUIZZES_ERROR,
  deleteQuiz: DELETE_QUIZ_ERROR,
};

const quizReducer = (state, action) => {
  switch (action.type) {
    case CREATING_QUIZ:
      return { ...state, creatingQuiz: action.payload };
    case FETCHING_QUIZ:
      return { ...state, fetchingQuizzes: action.payload };
    case FETCH_QUIZZES_ERROR:
      return { ...state, fetchQuizzesError: action.payload };
    case CREATE_QUIZ_ERROR:
      return { ...state, createQuizError: action.payload };
    case SET_QUIZZES:
      return { ...state, quizzes: action.payload };
    case SET_QUIZZES_COUNT:
      return { ...state, quizzesCount: action.payload };
    case DELETING_QUIZ:
      return { ...state, deletingQuiz: action.payload };
    case DELETE_QUIZ_ERROR:
      return { ...state, deleteQuizError: action.payload };
    default:
      return state;
  }
};

const fetchQuizzes = (dispatch) => async (params) => {
  dispatch({ type: FETCHING_QUIZ, payload: true });
  dispatch({ type: FETCH_QUIZZES_ERROR, payload: null });

  try {
    const response = await adverts247Api.get("/quizzes", {
      headers: { Authorization: `Bearer ${resolveToken()}` },
      params: { ...params, sortBy: "createdAt", orderBy: "desc" },
    });

    dispatch({ type: SET_QUIZZES, payload: response.data.quizzes });
    dispatch({ type: SET_QUIZZES_COUNT, payload: response.data.count });
    dispatch({ type: FETCHING_QUIZ, payload: false });
  } catch (err) {
    if (err.response) {
      dispatch({
        type: FETCH_QUIZZES_ERROR,
        payload:
          err.response.data.message ||
          "Unable to fetch quizzes. Something went wrong",
      });
    } else {
      dispatch({
        type: FETCH_QUIZZES_ERROR,
        payload: "Unable to fetch quizzes. Something went wrong",
      });
    }
    dispatch({ type: FETCHING_QUIZ, payload: false });
  }
};

const createNewQuiz = (dispatch) => async (createData, cb) => {
  dispatch({ type: CREATING_QUIZ, payload: true });
  dispatch({ type: CREATE_QUIZ_ERROR, payload: null });

  try {
    await adverts247Api.post("/quizzes", createData, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: CREATING_QUIZ, payload: false });
    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: CREATE_QUIZ_ERROR,
        payload:
          err.response.data.message ||
          "Unable to create quiz. Something went wrong",
      });
    } else {
      dispatch({
        type: CREATE_QUIZ_ERROR,
        payload: "Unable to create quiz. Something went wrong",
      });
    }
    dispatch({ type: CREATING_QUIZ, payload: false });
  }
};

const deleteQuiz = (dispatch) => async (quizId, cb) => {
  dispatch({ type: DELETING_QUIZ, payload: true });
  dispatch({ type: DELETE_QUIZ_ERROR, payload: null });

  try {
    await adverts247Api.delete(`/quiz/${quizId}`, {
      headers: { Authorization: `Bearer ${resolveToken()}` },
    });

    dispatch({ type: DELETING_QUIZ, payload: false });
    cb && cb();
  } catch (err) {
    if (err.response) {
      dispatch({
        type: DELETE_QUIZ_ERROR,
        payload:
          err.response.data.message ||
          "Unable to delete quiz. Something went wrong",
      });
    } else {
      dispatch({
        type: DELETE_QUIZ_ERROR,
        payload: "Unable to delete quiz. Something went wrong",
      });
    }

    dispatch({ type: DELETING_QUIZ, payload: false });
  }
};

const clearError = (dispatch) => (actionType) => {
  dispatch({ type: mapErrorDispatchToAction[actionType], payload: null });
};

export const { Context, Provider } = createDataContext(
  quizReducer,
  {
    creatingQuiz: false,
    createQuizError: null,
    fetchingQuizzes: false,
    fetchQuizzesError: null,
    quizzes: [],
    quizzesCount: 0,
    deletingQuiz: false,
    deleteQuizError: null,
  },
  { createNewQuiz, fetchQuizzes, deleteQuiz, clearError }
);

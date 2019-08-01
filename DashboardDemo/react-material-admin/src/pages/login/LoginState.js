import axios from 'axios';
export const initialState = {
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("id_token"),
  error: null
};

export const START_LOGIN = "Login/START_LOGIN";
export const LOGIN_SUCCESS = "Login/LOGIN_SUCCESS";
export const LOGIN_FAILURE = "Login/LOGIN_FAILURE";
export const RESET_ERROR = "Login/RESET_ERROR";
export const LOGIN_USER = "Login/LOGIN_USER";
export const SIGN_OUT_SUCCESS = "Login/SIGN_OUT_SUCCESS";

export const startLogin = (login, password) => ({

  type: START_LOGIN,
});

export const loginSuccess = () => ({
  type: LOGIN_SUCCESS
});

export const loginFailure = () => ({
  type: LOGIN_FAILURE
});

export const resetError = () => ({
  type: RESET_ERROR
});

export const loginUser = (login, password) => async (dispatch) => {
  // dispatch(startLogin(login, password));
  const auth = await axios({
     method: 'post',
     url: 'http://localhost:5000/login/',
     data: {
       netid: login,
       password: password
     },
     headers: {
       'Access-Control-Allow-Origin':'True',
       'Content-Type':'application/json'
     }
  });

  console.log(auth)
  if (auth.status === 200) {
  // if (!!login && !!password) {
    setTimeout(() => {
      localStorage.setItem("id_token", auth.data.token);
      dispatch(loginSuccess());
    }, 2000);
  } else {
    dispatch(loginFailure());
  }
};

export const signOutSuccess = () => ({
  type: SIGN_OUT_SUCCESS
});

export const signOut = () => dispatch => {
  localStorage.removeItem("id_token");
  dispatch(signOutSuccess());
};

export default function LoginReducer(state = initialState, { type, payload }) {
  switch (type) {
    case START_LOGIN:
      return {
        ...state,
        isLoading: true
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        error: null
      };
    case LOGIN_FAILURE:
      return {
        ...state,
        isLoading: false,
        error: true
      };
    case RESET_ERROR:
      return {
        error: false
      };
    case SIGN_OUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false
      };
    default:
      return state;
  }
}

import {LOGIN, LOGOUT} from '../actions/actionTypes';

const initialState = {
  isLoggedIn: false,
  userId: '',
  sessionCookie: '',
  userType: '',
};

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        userId: action.payload.user_id,
        sessionCookie: action.payload.session_cookie,
        userType: action.payload.user_type,
      };
    case LOGOUT:
      return {
        ...state,
        ...initialState,
      };
    default:
      return state;
  }
};

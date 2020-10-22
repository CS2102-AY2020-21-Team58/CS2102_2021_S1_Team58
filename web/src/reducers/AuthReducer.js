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
        isLoggedIn: true,
        userId: action.payload.userId,
        sessionCookie: action.payload.sessionCookie,
        userType: action.payload.userType,
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

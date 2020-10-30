import React, {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';
import {LOGOUT} from '../../actions/actionTypes';

const Logout = () => {
  Cookies.remove('petpals');
  Cookies.remove('petpals-userType');
  Cookies.remove('petpals-email');
  Cookies.remove('caretaker-type');

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch({type: LOGOUT});
    // eslint-disable-next-line
  }, []);

  return <Redirect to="/" />;
};

export default Logout;

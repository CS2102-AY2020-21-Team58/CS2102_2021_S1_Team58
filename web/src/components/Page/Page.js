import React from 'react';
import {useSelector} from 'react-redux';
import {Navbar} from '../Navbar';
import style from './Page.module.css';

const Page = () => {
  const authState = useSelector(state => state.auth);
  return (
    <div className={style.page}>
      <Navbar isLoggedIn={authState.isLoggedIn} userType={authState.userType} />
      <div>Dummy Content</div>
    </div>
  );
};

export default Page;

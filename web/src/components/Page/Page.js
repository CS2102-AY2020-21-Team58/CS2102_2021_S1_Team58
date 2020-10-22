import React from 'react';
import {useSelector} from 'react-redux';
import {Route, Switch} from 'react-router-dom';
import {Navbar} from '../Navbar';
import {Login} from '../../pages/Login';
import {Register} from '../../pages/Register';
import style from './Page.module.css';

const Page = () => {
  const authState = useSelector(state => state.auth);
  const homePage = () => <p>Home Page</p>;
  return (
    <div className={style.page}>
      <Navbar isLoggedIn={authState.isLoggedIn} userType={authState.userType} />

      <div className={style.content}>
        <Switch>
          <Route exact path="/" component={homePage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
      </div>
    </div>
  );
};

export default Page;

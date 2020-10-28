import React from 'react';
import {Navbar as NavbarBS, Nav, NavDropdown} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import {isCookieSet} from '../../utils';
import style from './Navbar.module.css';

const Navbar = props => {
  const isLoggedIn = props.isLoggedIn || isCookieSet();
  const userType = Cookies.get('petpals-userType');
  return (
    <NavbarBS bg="light" className={style.navbar}>
      <Link to="/">
        <NavbarBS.Brand>Pet-Pals</NavbarBS.Brand>
      </Link>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {!isLoggedIn ? (
          <>
            <Link to="/login">
              <NavbarBS.Text className={style.nav_links}>Login</NavbarBS.Text>
            </Link>
            <Link to="/register">
              <NavbarBS.Text className={style.nav_links}>
                Register
              </NavbarBS.Text>
            </Link>
          </>
        ) : null}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {isLoggedIn ? (
          <NavDropdown
            className={style.nav_links}
            title="Bids"
            id="bids-dropdown">
            {userType === 'Owner' || userType === 'Administrator' ? (
              <Link to="/owner-bids">
                <NavDropdown.Item href="/owner-bids">
                  Bids (Owner)
                </NavDropdown.Item>
              </Link>
            ) : null}
            {userType === 'Caretaker' || userType === 'Administrator' ? (
              <Link to="/caretaker-bids">
                <NavDropdown.Item href="/caretaker-bids">
                  Bids (Caretaker)
                </NavDropdown.Item>
              </Link>
            ) : null}
          </NavDropdown>
        ) : null}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {(isLoggedIn && userType === 'Owner') ||
        userType === 'Administrator' ? (
          <Link to="/pets">
            <NavbarBS.Text className={style.nav_links}>Pets</NavbarBS.Text>
          </Link>
        ) : null}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {(isLoggedIn && userType === 'Caretaker') ||
        userType === 'Administrator' ? (
          <Link to="/leaves">
            <NavbarBS.Text className={style.nav_links}>Leaves</NavbarBS.Text>
          </Link>
        ) : null}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {isLoggedIn && userType === 'Administrator' ? (
          <Link to="/salary">
            <NavbarBS.Text className={style.nav_links}>Salary</NavbarBS.Text>
          </Link>
        ) : null}
      </Nav>
      {isLoggedIn ? (
        <NavbarBS.Collapse className="justify-content-end">
          <NavbarBS.Text>User Type: {userType}</NavbarBS.Text>
        </NavbarBS.Collapse>
      ) : null}
    </NavbarBS>
  );
};

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
};

export default Navbar;

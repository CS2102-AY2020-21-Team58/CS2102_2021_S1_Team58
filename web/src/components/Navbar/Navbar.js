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
      <NavbarBS.Brand href="/">Pet-Pals</NavbarBS.Brand>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {isLoggedIn ? (
          <>
            <Link to="/">
              <NavbarBS.Text className={style.nav_links}>
                Home Page
              </NavbarBS.Text>
            </Link>
          </>
        ) : (
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
        )}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {isLoggedIn ? (
          <NavDropdown
            className={style.nav_links}
            title="Bids"
            id="bids-dropdown">
            {userType === 'Owner' || userType === 'Administrator' ? (
              <NavDropdown.Item href="/owner-bids" tag={Link}>
                Bids (Owner)
              </NavDropdown.Item>
            ) : null}
            {userType === 'Caretaker' || userType === 'Administrator' ? (
              <NavDropdown.Item href="/caretaker-bids" tag={Link}>
                Bids (Caretaker)
              </NavDropdown.Item>
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

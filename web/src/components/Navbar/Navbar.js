import React from 'react';
import {Navbar as NavbarBS, Nav, NavDropdown} from 'react-bootstrap';
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
            <Nav.Link className={style.nav_links} href="/">
              Home Page
            </Nav.Link>
          </>
        ) : (
          <>
            <Nav.Link href="/login" className={style.nav_links}>
              Login
            </Nav.Link>
            <Nav.Link href="/register" className={style.nav_links}>
              Register
            </Nav.Link>
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
              <NavDropdown.Item href="/owner-bids">
                Bids (Owner)
              </NavDropdown.Item>
            ) : null}
            {userType === 'Caretaker' || userType === 'Administrator' ? (
              <NavDropdown.Item href="/caretaker-bids">
                Bids (Caretaker)
              </NavDropdown.Item>
            ) : null}
          </NavDropdown>
        ) : null}
      </Nav>
      <Nav className={`mr-auto ${style.nav_flex}`}>
        {isLoggedIn && userType === 'Owner' ? (
          <Nav.Link href="/pets" className={style.nav_links}>
            Pets
          </Nav.Link>
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

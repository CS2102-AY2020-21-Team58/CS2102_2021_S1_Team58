import React from 'react';
import {Navbar as NavbarBS, Nav} from 'react-bootstrap';
import PropTypes from 'prop-types';
import style from './Navbar.module.css';

const Navbar = props => (
  <NavbarBS bg="light" expand="lg">
    <NavbarBS.Brand>Pet-Pals</NavbarBS.Brand>
    <Nav className={`mr-auto ${style.navbar}`}>
      {props.isLoggedIn ? (
        <>
          <Nav.Link href="/">Testing Link</Nav.Link>
          <NavbarBS.Text className="justify-content-end">
            User Type: ${props.userType}
          </NavbarBS.Text>
        </>
      ) : (
        <>
          <Nav.Link href="/" className={style.nav_links}>
            TODO LOGIN
          </Nav.Link>
          <Nav.Link href="/" className={style.nav_links}>
            TODO Register
          </Nav.Link>
        </>
      )}
    </Nav>
  </NavbarBS>
);

Navbar.propTypes = {
  isLoggedIn: PropTypes.func.isRequired,
  userType: PropTypes.func.isRequired,
};

export default Navbar;

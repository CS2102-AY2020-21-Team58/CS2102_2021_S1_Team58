import React from 'react';
import {Navbar as NavbarBS, Nav} from 'react-bootstrap';
import PropTypes from 'prop-types';
import style from './Navbar.module.css';

const Navbar = props => (
  <NavbarBS bg="light" expand="lg" className={style.navbar}>
    <NavbarBS.Brand>Pet-Pals</NavbarBS.Brand>
    <Nav className={`mr-auto ${style.nav_flex}`}>
      {props.isLoggedIn ? (
        <>
          <Nav.Link className={style.nav_links} href="/">
            Testing Link
          </Nav.Link>
        </>
      ) : (
        <>
          <Nav.Link href="/" className={style.nav_links}>
            Login
          </Nav.Link>
          <Nav.Link href="/" className={style.nav_links}>
            Register
          </Nav.Link>
        </>
      )}
    </Nav>
    {props.isLoggedIn ? (
      <NavbarBS.Collapse className="justify-content-end">
        <NavbarBS.Text>User Type: {props.userType}</NavbarBS.Text>
      </NavbarBS.Collapse>
    ) : null}
  </NavbarBS>
);

Navbar.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userType: PropTypes.string.isRequired,
};

export default Navbar;

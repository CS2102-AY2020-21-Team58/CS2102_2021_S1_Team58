import React from 'react';
import PropTypes from 'prop-types';
import {Modal as ModalBS} from 'react-bootstrap';

const Modal = props => (
  <ModalBS enforceFocus={false} show={props.show} onHide={props.handleClose}>
    <ModalBS.Header closeButton>
      <ModalBS.Title>{props.title}</ModalBS.Title>
    </ModalBS.Header>
    {props.children}
  </ModalBS>
);

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.instanceOf(Object).isRequired,
};

export default Modal;

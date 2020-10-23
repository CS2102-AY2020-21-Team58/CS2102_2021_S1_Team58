import React from 'react';
import PropTypes from 'prop-types';
import {Modal as ModalBS} from 'react-bootstrap';

const Modal = props => (
  <ModalBS show={props.show} onHide={props.handleClose}>
    <ModalBS.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </ModalBS.Header>
    {props.children}
  </ModalBS>
);

Modal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
};

export default Modal;

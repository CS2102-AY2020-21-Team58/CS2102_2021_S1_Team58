import React from 'react';
import {Form} from 'react-bootstrap';
import PropTypes from 'prop-types';
import style from './FormCustom.module.css';

const FormCustom = props => (
  <div className={style.form}>
    <Form onSubmit={props.onSubmit}>{props.children}</Form>
  </div>
);

FormCustom.propTypes = {
  children: PropTypes.instanceOf(Array).isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormCustom;

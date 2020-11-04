import React from 'react';
import PropTypes from 'prop-types';
import style from './InfoBox.module.css';

const InfoBox = props => (
  <div className={style.box}>
    <div className={style.title}>{props.title}</div>
    <div className={style.content}>{props.content}</div>
    <div className={style.subtitle}>
      {props.subtitle !== '' ? props.subtitle : null}
    </div>
  </div>
);

InfoBox.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
};

InfoBox.defaultProps = {
  subtitle: '',
};

export default InfoBox;

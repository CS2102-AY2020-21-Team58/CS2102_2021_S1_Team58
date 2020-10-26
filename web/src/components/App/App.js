import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Page} from '../Page';
import classes from './App.module.css';

const App = () => (
  <div className={classes.container}>
    <Page />
  </div>
);

export default App;

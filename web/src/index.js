import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import withReduxFeatures from './withReduxFeatures';
import App from './components/App';
import './index.css';

/** Wrap App component with store providers */
const WrappedApp = withReduxFeatures(App);

ReactDOM.render(
  <BrowserRouter>
    <WrappedApp />
  </BrowserRouter>,
  document.getElementById('root')
);

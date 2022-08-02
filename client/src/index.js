import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/datetime/lib/css/blueprint-datetime-modern.css';
import '@blueprintjs/table/lib/css/table.css';
import '@blueprintjs/select/lib/css/blueprint-select.css';

import 'mapbox-gl/dist/mapbox-gl.css';
import 'react-tiny-fab/dist/styles.css';
import 'react-vertical-timeline-component/style.min.css';
import 'react-toastify/dist/ReactToastify.css';




ReactDOM.render(

    <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

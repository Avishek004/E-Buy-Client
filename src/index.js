import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import 'antd/dist/antd.css';
import 'mdbreact/dist/css/mdb.css';
import 'bootstrap-css-only/css/bootstrap.min.css';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import rootReducer from './Redux/Reducers/rootReducer';

// Redux store
const store = createStore(rootReducer, composeWithDevTools());

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  // </React.StrictMode>
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

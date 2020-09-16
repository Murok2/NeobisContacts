import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { HashRouter } from 'react-router-dom';  
import { Provider } from 'react-redux';
import store from './redux/rootReducer'; 

ReactDOM.render(
  <React.StrictMode>
    <HashRouter >
      <Provider store={store}>
        <App />
      </Provider>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();

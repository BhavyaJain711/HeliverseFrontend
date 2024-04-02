import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from "react-redux";
import {store} from "./store";
import {persistStore} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import axios from 'axios';
import App from './App.jsx'
import './index.css'
const persistedStore=persistStore(store);
const baseURL = "http://localhost:5000/api/";
console.log(baseURL);
axios.defaults.baseURL=baseURL;
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
  <Provider store={store} >
  <PersistGate loading={null} persistor={persistedStore}>
  <App />
  </PersistGate>
  </Provider>
  </React.StrictMode>
)

import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import zhCN from "antd/lib/locale-provider/zh_CN";
import { LocaleProvider } from "antd";

import "./index.scss";

import Router from './Router';
import store from './store';

// 组件国际化



ReactDOM.render(
  <Provider store={store}>
    <LocaleProvider locale={zhCN}>
      <div className="viewport">
        <Router/>
      </div>
    </LocaleProvider>
  </Provider>, 
  document.getElementById("root"));

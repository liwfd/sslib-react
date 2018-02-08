import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
//import styles
import 'weui';
import 'react-weui/build/packages/react-weui.css';
//获取路由信息
import routes from './routes';
import configureStore from './store/configureStore';

// 增加页面权限控制
import RestUrl from '../dist/common/RestUrl';
import AuthToken from "../dist/utils/AuthToken";
import { Router, hashHistory } from 'react-router'
//初始化store
var store = configureStore()
var URL_WORKBENCH = RestUrl.URL_WORKBENCH;
var URL_HOME_PORTAL = RestUrl.URL_HOME_PORTAL;
var history = syncHistoryWithStore(hashHistory, store);
//高清组件显示
window.document.documentElement.style.fontSize = window.innerWidth * 100 / 750 + 'px';//新增

var portalOptions = {};
portalOptions.authentication = false;
portalOptions.url = URL_WORKBENCH;
portalOptions.success = function () {
    portalOptions.authentication = true;
    ReactDOM.render(
        <Provider store={store}>
            <Router history={history}>
                {routes}
            </Router>
        </Provider>
        , window.document.getElementById('root')
    );
};
portalOptions.error = function () {
    window.setTimeout(function () {
        if (portalOptions.authentication === false) {
            window.location.href = URL_HOME_PORTAL;
        }
    }, 1000);
};
AuthToken.init(portalOptions);
// registerServiceWorker();

/**
 * 路由配置
 */
import React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from '../App'; //主应用
import ImagePickerDemo from '../../dist/component/image-picker/demo/ImagePickerDemo';
import demo from '../../dist/component/modal/demo/demo';
import Drawer from '../../dist/component/drawer/demo/DrawerDemo';
import ListDemo from '../../dist/component/list/demo/ListDemo'
import ListTest from '../../dist/component/list/demo/ListTest'

export default
    <Route path="/" component={App}>
        <IndexRoute key='001' component={ImagePickerDemo}></IndexRoute>
        <Route path="modal" component={demo}/>
        <Route path="drawer" component={Drawer}/>
        <Route path="listDemo" component={ListDemo}/>
        <Route path="listTest" component={ListTest}/>
        <Route path="sign" component={ImagePickerDemo}/>
    </Route>
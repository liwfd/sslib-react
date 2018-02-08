import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';

class SSPage extends Component{

    /**
     *  路由跳转控制
     *  */
    routeTo(url, query, state) {
        if (!this.props.router) {
            console.error('调用routeTo失败,router不存在');return;
        }
        var location = {};
        if (url) location.pathname = url;
        if (query) location.query = query;
        if (state) location.state = state;
        this.props.router.push(location);
    }
    /**
     * 获取路由传递的参数值（隐藏参数）
     */
    getRouteParams() {
        if (!this.props.location && !this.props.params) {
            console.error('调用getRouteParams失败,location和params均不存在');return;
        }
        return _.isEmpty(this.props.location.state) ? _.isEmpty(this.props.params) ? null : this.props.params : this.props.location.state;
    }
    /**
     * 获取路由传递的URL参数值（直接链接在URL的?后面的参数列表）（显示参数）
     */
    getRouteQuery() {
        if (!this.props.location) {
            console.error('调用getRouteQuery失败,location不存在');return;
        }
        return _.isEmpty(this.props.location.query) ? null : this.props.location.query;
    }
    /**
     * 后退上一个页面
     */
    goBack() {
        if (!this.props.router) {
            console.error('调用goBack失败,router不存在');return;
        }
        this.props.router.goBack();
    }
    /**
     * 前进下一个页面
     */
    goForward() {
        if (!this.props.router) {
            console.error('调用goForward失败,router不存在');return;
        }
        this.props.router.goForward();
    }
    /**
     * 后退或前进到第N个页面
     * @param to n为正数则为前进，n为负数则为后退
     */
    goTo(to) {
        if (!this.props.router) {
            console.error('调用goTo失败,router不存在');return;
        }
        this.props.router.go(to);
    }
    render(){
        return (this.props.children);
    }
}

SSPage.propTypes = {
    refreshTime: PropTypes.number
};

SSPage.defaultProps = {
    refreshTime: 0
};

export default SSPage;
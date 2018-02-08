/**
 * Created By Tangjingqi 2017/8/30
 * */
import React, {Component} from 'react';
import {Tabs, WhiteSpace, Badge} from 'antd-mobile/lib/index';
import PropTypes from 'prop-types';
// import {createForm} from 'rc-form';
import _ from 'lodash';
import SSPosition from '../position/SSPosition';
import '../../../css/SSTab.css';

/*
|||||||||||||||||||||关于定位的修改///////////////////////////
* 1、display 设置tab上方定位图层的显示(block)或隐藏 （none）  默认是block
* 2、iconColor  设置定位坐标图标左边图标 eg: icon='xingzhuang1'
* 3、color 设置定位坐标文字的颜色
* 4、title 设置地位的坐标值
*5、
* |||||||||||||||||||||关于tab的修改///////////////////////////
* 1、defaultActiveKey  默认选中项  第一项"0"   第二项"1" 一次类推
 * 2、name  类型 Array   设置tab项数    eg : name=['1','2','3'] 3项
 *
* */


class SSTab extends React.Component {
    onChange = (key) => {
        if (_.isFunction(this.props.onChange)) this.props.onChange(key)
    }
    handleTabClick = (key) => {
        if (_.isFunction(this.props.handleTabClick)) this.props.handleTabClick(key)
    }

    render() {
        let {defaultActiveKey, names, icon, iconColor, titlevalue, display,displaytab, swipeable} = this.props;

        let style2={
            display:displaytab
        }

        const tabs = names.map((v, index) => ({title: v, sub: index}));
        return (
            <div>
                <SSPosition display={display} title={titlevalue} icon={icon} color={iconColor}/>
               <div style={style2}>
                   <Tabs swipeable={swipeable} tabs={tabs} activeTextColor="#fff" barStyle=''  initialPage={defaultActiveKey} animated={false}
                         onChange={this.onChange}
                         onTabClick={this.handleTabClick}>
                       {this.props.children}
                   </Tabs>
               </div>

            </div>
        )
    };
};

SSTab.defaultProps = {
    defaultActiveKey: 0, //默认的选中
    names: ['One Tab', 'Two Tab', 'Three Tab'],//设置tab项数量
    titlevalue: '',
    icon: 'icon-dingwei',
    iconColor: '',
    color: '',
    swipeable: true,
    display: 'block',
    displaytab:'block',
}
SSTab.PropTypes = {
    defaultActiveKey: PropTypes.string,
    names: PropTypes.arr,
    swipeable: PropTypes.boolean,
    position: PropTypes.string,
    icon: PropTypes.string,
    display: PropTypes.string,

}

export default SSTab;
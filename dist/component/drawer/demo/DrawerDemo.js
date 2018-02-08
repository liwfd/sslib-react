import React, {Component} from 'react';
import SSDrawer from "../SSDrawer";
import SSButton from "../../button/SSButton";
import { List } from 'antd-mobile/lib/index';
import {hashHistory} from 'react-router';


export default class DrawerDemo extends Component{
    state = {
        open: true,
    }

    onOpenChange = (...args) => {
        console.log(args);
        this.setState({ open: !this.state.open });
    }

    click = () => {
        hashHistory.goBack();
    }

    render() {
        const sidebar = (<List>
            {[...Array(20).keys()].map((i, index) => {
                return (<List.Item key={index}
                                   thumb="https://zos.alipayobjects.com/rmsportal/eOZidTabPoEbPeU.png"
                >Category{index}</List.Item>);
            })}
        </List>);

        return (
            <div>
                <SSButton onClick={this.click} text="呵呵"/>
            </div>
        );
    }
}
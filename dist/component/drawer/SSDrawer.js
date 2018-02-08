import React, {Component} from 'react';
import { Drawer } from 'antd-mobile/lib/index';

class SSDrawer extends Component{
    render() {
        return (<Drawer {...this.props}>
            {this.props.children}
        </Drawer>);
    }
}
SSDrawer.defaultProps = {

}
export default SSDrawer;
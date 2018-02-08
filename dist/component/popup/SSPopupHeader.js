import React, {Component} from 'react';
import { PopupHeader } from 'react-weui';
import _ from 'lodash';

class SSPopupHeader extends Component{

    leftOnClick = () => {
        if(_.isFunction(this.props.leftOnClick)){
            this.props.leftOnClick();
        }else{

        }
    }

    rightOnClick = () => {
        if(_.isFunction(this.props.rightOnClick)){
            this.props.rightOnClick();
        }else{

        }
    }

    render() {
        const { left, right } = this.props;
        return (
            <PopupHeader
                left={left}
                right={right}
                leftOnClick={this.leftOnClick}
                rightOnClick={this.rightOnClick}
            />
        );
    }
}
SSPopupHeader.defaultProps = {
    left: '取消',
    right: '确定',
}
export default SSPopupHeader;
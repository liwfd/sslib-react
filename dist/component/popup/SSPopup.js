import React, {Component} from 'react';
import {Popup} from 'react-weui';
import _ from 'lodash';

class SSPopup extends Component {

    componentWillMount() {
        let that = this;
        document.addEventListener("backbutton", () => {
            if (_.isFunction(that.props.backClick)) {
                that.props.backClick();
            }
        }, false);
    }

    render() {
        const {show,fullScreen} = this.props;
        let style = {
            height: fullScreen ? '100vh' : 'auto',
            overflow: 'scroll',
            zIndex: 5000,
            display: show ? '' : 'none',
            position: 'fixed',
            left: 0,
            top:0,
            // bottom: 0,
            width: '100vw',
            backgroundColor: '#EFEFF4',
        }
        return (
            <div className="animated fadeInRight" style={style}>
                {this.props.children}
            </div>
        );
    }
}

SSPopup.defaultProps = {
    show: false,
    fullScreen: true,
}
export default SSPopup;
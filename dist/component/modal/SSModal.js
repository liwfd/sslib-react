import React, {Component} from 'react';
import { Modal } from 'antd-mobile/lib/index';

class SSModal extends Component{
    static alert = Modal.alert;
    static operation = Modal.operation;
    static prompt = Modal.prompt;

    render() {
        return (<Modal {...this.props} />);
    }
}
SSModal.defaultProps = {
}
export default SSModal;
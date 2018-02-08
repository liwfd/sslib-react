import React, {Component} from 'react';
import SSModal from "./SSModal";
import _ from 'lodash';

export default class SSYNModal extends Component{

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
    }

    ynCheck = flag => () => {
        if(_.isFunction(this.props.onYNClick)){
            this.props.onYNClick(flag);
        }
    }


    render() {
        const style1 = {
            float: 'left',
            height: 100,
            width: '50%',
            border: '1px solid #ccc',
            fontSize: '1.3rem',
            borderRadius: '5px 0 0 5px',
            color: 'green',
            textAlign:'center'
        };
        const style2 = {
            float: 'left',
            height: 100,
            width: '50%',
            border: '1px solid #ccc',
            fontSize: '1.3rem',
            borderRadius: '0 5px 5px 0',
            borderLeft:'none',
            color: 'red',
            textAlign:'center'
        };

        return (<SSModal
            className='CellYn'
            visible={this.props.show}
            transparent
            maskClosable={true}
            onClose={this.props.onClose}
            // title="是/否判断法"
            footer={[{
                text: '重置', onPress: () => {
                    this.ynCheck()();
                }
            }]}
            wrapProps={{onTouchStart: this.onWrapTouchStart}}
        >
            <div style={{height: 100, overflow: 'scroll'}}>
                <div style={style1} onClick={this.ynCheck(1)}>是</div>
                <div style={style2} onClick={this.ynCheck(0)}>否</div>
            </div>
        </SSModal>);
    }

}
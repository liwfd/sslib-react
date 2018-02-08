import React, {Component} from 'react';
import SSModal from "./SSModal";
import SSIcon from "../icon/SSIcon";
import _ from 'lodash';
import SSCellCss from '../../../css/SSCell.css';

const style1 = {
    lineHeight: '2.15',
    width: '100%',
    border: 'none',
    textAlign: 'center'
};

const style2 = {
    marginTop: '7px',
    width: '30%',
    marginRight: '3%',
    border: '1px solid #ccc',
    float: 'left',
};

export default class SSMGModal extends Component {
    state = {
        inputCell: []
    }

    componentWillMount() {
        this.initCell();
    }

    initCell = () => {
        let arr = [];
        for (let i = 0; i < 5; i++) {
            arr.push(<div key={i} style={style2}><input type='number' onChange={this.onChange} style={style1}/></div>);
        }
        this.setState({
            inputCell: arr
        })
    }

    addInputCell = () => {
        let curArr = this.state.inputCell;
        curArr.push(<div key={curArr.length} onChange={this.onChange} style={style2}><input type='number'
                                                                                            style={style1}/></div>);
        this.setState({
            inputCell: curArr
        })
    }

    resetModal = () => {
        let mgModal = document.getElementById('mgModal');
        if (!mgModal) return;
        let tagElements = mgModal.getElementsByTagName('input');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].value = '';
        }
        this.initCell()
    }

    onChange() {
        let mgModal = document.getElementById('mgModal');
        let values = new Array();
        let tagElements = mgModal.getElementsByTagName('input');
        let standard = null;
        let maxGap = 0;
        for (let i = 0; i < tagElements.length; i++) {
            if (tagElements[i].className == 'standard') {
                standard = tagElements[i].value;
            } else {
                tagElements[i].className != 'maxGap' && tagElements[i].value && values.push(tagElements[i].value);
            }
        }
        let max = Math.max(...values);
        let min = Math.min(...values);
        if (standard) {
            if(Math.abs(max - standard)>=Math.abs(standard - min)){
                maxGap = max - standard;
            }else{
                maxGap = min- standard;
            }
            // maxGap = Math.max(Math.abs(max - standard), Math.abs(standard - min));
            mgModal.getElementsByClassName('maxGap')[0].value = maxGap;
        }
    }

    standardChange = () => {
        let mgModal = document.getElementById('mgModal');
        let values = new Array();
        let tagElements = mgModal.getElementsByTagName('input');
        let standard = null;
        let maxGap = 0;
        for (let i = 0; i < tagElements.length; i++) {
            if (tagElements[i].className == 'standard') {
                standard = tagElements[i].value;
            } else {
                tagElements[i].className != 'maxGap' && tagElements[i].value && values.push(tagElements[i].value);
            }
        }
        let max = Math.max(...values);
        let min = Math.min(...values);
        if (standard && values.length > 0) {
            if(Math.abs(max - standard)>=Math.abs(standard - min)){
                maxGap = max - standard;
            }else{
                maxGap = min- standard;
            }
            // maxGap = Math.max(Math.abs(max - standard), Math.abs(standard - min));
            mgModal.getElementsByClassName('maxGap')[0].value = maxGap;
        } else {
            mgModal.getElementsByClassName('maxGap')[0].value = '';
        }
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
    }

    _close = () => {
        if (_.isFunction(this.props.onClose)) {
            this.props.onClose();
        }
        this.resetModal();
    }

    render() {
        const {inputCell} = this.state;
        const style1 = {
            marginTop: '7px',
            lineHeight: '2.15',
            width: '30%',
            border: '1px solid #ccc',
            float: 'left',
            backgroundColor: '#eee',
            textAlign: 'center',
            marginRight: '3%'
        };

        const style2 = {
            lineHeight: '2.15',
            width: '30%',
            border: '1px solid #ccc',
            marginRight: '3%',
            textAlign: 'center'
        };

        const style3 = {
            width: '70px',
            paddingTop: '14px',
            paddingRight: '10px',
            color: '#000',
            fontSize: 14,
            textAlign: 'right',
        };

        return (<SSModal
                className='ModalTop'
                style={{width: '7rem'}}
                visible={this.props.show}
                transparent
                maskClosable={true}
                onClose={this._close}
                footer={[{
                    text: '重置',
                    onPress: () => {
                        this.resetModal();
                        if (_.isFunction(this.props.onReset)) {
                            this.props.onReset();
                        }

                    },
                }, {
                    text: '确定',
                    onPress: () => {
                        let mgModal = document.getElementById('mgModal');
                        let maxGap = mgModal.getElementsByClassName('maxGap')[0].value;
                        this.resetModal();
                        if (_.isFunction(this.props.onOk)) {
                            this.props.onOk(maxGap);
                        }
                    },
                }]}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
            >
                <div style={{height: 'auto', display: 'inline-block', padding: '0 auto'}}>
                    <form id='mgModal'>
                        <div className='flexFather'>
                            <div style={style3}>标准值</div>
                            <div className='flexSon1' style={{
                                padding: 0,
                                marginTop: 8,

                            }}>
                                <input className='standard' onChange={this.standardChange} style={style2}
                                       type='number'/>
                            </div>
                        </div>
                        <div className='flexFather'>
                            <div style={style3}>测量值</div>
                            <div className='flexSon1' style={{
                                height: 'auto',
                                padding: '0 auto',
                            }}>
                                {inputCell}
                                <div style={style1} onClick={this.addInputCell}><SSIcon icon="icon-stepAdd"/></div>
                            </div>
                        </div>
                        <div className='flexFather'>
                            <div style={style3}>最大偏差</div>
                            <div className='flexSon1' style={{
                                marginTop: 8,
                                textAlign: 'left',
                            }}><input className='maxGap' style={{
                                lineHeight: '2.15',
                                width: '50%',
                                border: '1px solid #ccc',
                                textAlign: 'center'
                            }} type='number' disabled/>
                            </div>
                        </div>
                    </form>
                </div>
            </SSModal>
        );
    }

}
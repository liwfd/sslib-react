import React, {Component} from 'react';
import SSModal from "./SSModal";
import SSIcon from "../icon/SSIcon";
import _ from 'lodash';
import SSCellCss from '../../../css/SSCell.css';

const style1 = {
    lineHeight: '2.15',
    width:'100%',
    border:'none',
    textAlign:'center'
};

const style2 = {
    marginTop: '7px',
    width: '30%',
    marginRight:'3%',
    border: '1px solid #ccc',
    float:'left',
};

export default class SSRangeModal extends Component{
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

    onChange() {
        let form = document.getElementById('rangeModal');
        let values = new Array();
        let tagElements = form.getElementsByTagName('input');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].className != 'gap' && tagElements[i].value && values.push(tagElements[i].value);
        }
        let max = Math.max(...values);
        let min = Math.min(...values);
        if (values.length > 1) {
            form.getElementsByClassName('gap')[0].value = max - min;
        }else{
            form.getElementsByClassName('gap')[0].value = null;
        }

        //控制输入内容的颜色（最大值红色， 最小值绿色）
        for (let i = 0; i < tagElements.length; i++) {
            if (values.length <= 1) {
                tagElements[i].style.color = '';
            }else if (tagElements[i].className == 'gap') {
                tagElements[i].style.color = '';
            } else if (max == tagElements[i].value) {
                tagElements[i].style.color = 'red';
            } else if (min == tagElements[i].value) {
                tagElements[i].style.color = 'green';
            } else {
                tagElements[i].style.color = '';
            }
        }
    }

    resetModal = () => {
        let rangeModal = document.getElementById('rangeModal');
        if(!rangeModal) return;
        let tagElements = rangeModal.getElementsByTagName('input');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].value = '';
        }
        this.initCell()
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
    }

    _close = () => {
        if(_.isFunction(this.props.onClose)){
            this.props.onClose();
        }
        this.resetModal();
    }

    render() {
        const { inputCell } = this.state;
        const style1 = {
            marginTop: '7px',
            lineHeight: '2.15',
            width: '30%',
            border: '1px solid #ccc',
            float: 'left',
            backgroundColor: '#eee',
            textAlign:'center',
            marginRight:'3%'
        };

        const style2 = {
            display: 'inline-block',
            float: 'left',
            width: '20%',
            paddingTop: 16,
            color: '#000',
            fontSize: 12
        };

        const style3 = {
            width: '70px',
            paddingTop: '14px',
            paddingRight: '10px',
            color: '#000',
            fontSize: 14,
            textAlign:'right',
        };

        const style4 = {
            display: 'inline-block',
            float: 'left',
            width: '20%',
            paddingTop: 16,
            color: '#000',
            fontSize: 12
        };

        const style5 = {
            display: 'inline-block',
            padding: 0,
            marginLeft: -7,
            marginTop: 8,
            border: '1px solid #ccc'
        };

        return (<SSModal
                className='ModalTop'
                style={{width:'7rem'}}
                visible={this.props.show}
                transparent
                maskClosable={true}
                onClose={this._close}
                footer={[{
                    text: '重置', onPress: () => {
                        this.resetModal();
                        if(_.isFunction(this.props.onReset)){
                            this.props.onReset();
                        }
                    }
                }, {
                    text: '确定', onPress: () => {
                        let rangeModal = document.getElementById('rangeModal');
                        let gap = rangeModal.getElementsByClassName('gap')[0].value;
                        this.resetModal();
                        if(_.isFunction(this.props.onOk)){
                            this.props.onOk(gap);
                        }
                    }
                }]}
                wrapProps={{onTouchStart: this.onWrapTouchStart}}
            >
                <form id="rangeModal">
                    <div className='flexFather'>
                        <div style={style3}>实测值
                        </div>
                        <div className='flexSon1' style={{
                            height: 'auto',
                            padding: '0 auto',
                        }}>
                            { inputCell }
                            <div style={style1} onClick={this.addInputCell}><SSIcon icon="icon-stepAdd"/></div>
                        </div>
                    </div>
                    <div className='flexFather'>
                        <div style={style3}>极差值</div>
                        <div className='flexSon1'  style={{
                            marginTop: 8,
                            textAlign:'left',
                        }}><input className='gap' style={{lineHeight: '2.15', width: '50%',border: '1px solid #ccc',textAlign:'center'}} type='number' disabled/>
                        </div>
                    </div>

                </form>
            </SSModal>
        );
    }

}
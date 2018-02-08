import React, {Component} from 'react';
import SSPage from '../../page/SSPage';
import SSForm from '../../form/SSForm';
import SSModal from '../SSModal';
import {Modal} from 'antd-mobile/lib/index';
import SSButton from '../../button/SSButton';
import SSAccordion from '../../accordion/SSAccordion';
import SSAccordionPanel from '../../accordion/SSAccordionPanel';
import SSRefer from "../../refer/SSRefer";
import SSIcon from "../../icon/SSIcon";

const prompt = SSModal.prompt;

const style3 = {
    // marginLeft: 4,
    lineHeight: '2.15',
    width: 50
};

const style4 = {
    // marginLeft: 4,
    lineHeight: '2.15',
    width: 70
};

const style5 = {
    margin: '7px 0 0 7px',
    float: 'left',
    border: '1px solid #ccc',
};

const style6 = {
    height: 35,
    width: 70,
    border: '1px solid #bbb',
    textAlign: 'center',
    paddingTop: 4
};

class NativeDemo extends SSPage {

    state = {
        modal1: false,
        curIndex: null,
        inputArr: [],
        inputArr1: [],
        inputArr2: [],
        inputArr3: [],
        inputArr4: []
    };

    getInputRow = (index) => {
        return (<div key={index} style={{height: 45}}>
            <div style={style5}><input type='number' style={style4}/></div>
            <div style={style5}><input type='number' style={style4}/></div>
            <div style={style5}><input type='number' style={style4}/></div>
            <div style={style5}><input type='number' style={style4}/></div>
            <div style={{display: 'inline-block', paddingTop: 16, paddingLeft: 12}}>
                <SSIcon size='md' color='red' onClick={this.delInput.bind(this, index)} icon="icon-shanchu1"/>
            </div>
        </div>);
    }

    getDivRow = (index) => {
        return (<div key={index} style={{height: 45}}>
            <div style={style5}><div className='divRow' key={index * 10} id={index * 10} onClick={this.onClick2('modal1').bind(this, index * 10)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 1} id={index * 10 + 1} onClick={this.onClick2('modal1').bind(this, index * 10 + 1)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 2} id={index * 10 + 2} onClick={this.onClick2('modal1').bind(this, index * 10 + 2)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 3} id={index * 10 + 3} onClick={this.onClick2('modal1').bind(this, index * 10 + 3)} style={style6}></div></div>
            <div style={{display: 'inline-block', paddingTop: 16, paddingLeft: 12}}>
                <SSIcon size='md' color='red' onClick={this.delSpan.bind(this, index)} icon="icon-shanchu1"/>
            </div>
        </div>);
    }

    getDivRow2 = (index) => {
        return (<div key={index} style={{height: 45}}>
            <div style={style5}><div className='divRow' key={index * 10} id={index * 10} onClick={this.onClick2('modal2').bind(this, index * 10)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 1} id={index * 10 + 1} onClick={this.onClick2('modal2').bind(this, index * 10 + 1)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 2} id={index * 10 + 2} onClick={this.onClick2('modal2').bind(this, index * 10 + 2)} style={style6}></div></div>
            <div style={style5}><div className='divRow' key={index * 10 + 3} id={index * 10 + 3} onClick={this.onClick2('modal2').bind(this, index * 10 + 3)} style={style6}></div></div>
            <div style={{display: 'inline-block', paddingTop: 16, paddingLeft: 12}}>
                <SSIcon size='md' color='red' onClick={this.delSpan2.bind(this, index)} icon="icon-shanchu1"/>
            </div>
        </div>);
    }


    componentWillMount() {
        this.resetInput();
    }

    resetInput = () => {
        let arr = [];
        let arr2 = [];
        let arr3 = [];
        let arr4 = [];
        let arr5 = [];
        for (let i = 0; i < 3; i++) {
            arr.push(<div key={i} style={style5}><input type='number' onChange={this.onChange} style={style3}/></div>);
            arr3.push(<div key={i} style={style5}><input type='number' onChange={this.onChange1} style={style3}/></div>);
        }

        arr2.push(this.getInputRow(0));
        arr4.push(this.getDivRow(0));
        arr5.push(this.getDivRow2(0));
        this.setState({
            inputArr: arr,
            inputArr1: arr3,
            inputArr2: arr2,
            inputArr3: arr4,
            inputArr4: arr5
        })
    }

    onChange() {
        let form = document.getElementById('modal3');
        let values = new Array();
        let tagElements = form.getElementsByTagName('input');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].className != 'gap' && tagElements[i].value && values.push(tagElements[i].value);
        }
        let max = Math.max(...values);
        let min = Math.min(...values);
        if (values.length > 1) {
            form.getElementsByClassName('gap')[0].value = max - min;
        }

        for (let i = 0; i < tagElements.length; i++) {
            if (values.length <= 1) break;
            if (tagElements[i].className == 'gap') {
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

    onChange1() {
        let form = document.getElementById('modal2');
        let values = new Array();
        let tagElements = form.getElementsByTagName('input');
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
            maxGap = Math.max(Math.abs(max - standard), Math.abs(standard - min));
            form.getElementsByClassName('maxGap')[0].value = maxGap;
        }
    }

    onClick = key => (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    ynCheck = flag => () => {
        let form = document.getElementById('modal5');
        let tagElements = form.getElementsByClassName('divRow');
        for(let i = 0; i< tagElements.length; i++){
            if(tagElements[i].id == this.state.curIndex + ''){
                if(flag == 0){
                    tagElements[i].innerHTML = '否';
                    tagElements[i].style.color = 'red';
                }else if(flag == 1){
                    tagElements[i].innerHTML = '是';
                    tagElements[i].style.color = 'green';
                }else{
                    tagElements[i].innerHTML = '';
                    tagElements[i].style.color = '';
                }
            }
        }
        this.onClose('modal1')();
    }

    onClick2 = key => (value) => {
        this.reset('modal2');
        this.setState({
            [key]: true,
            curIndex: value
        });
    }

    /*onClick = (e) => {
        e.preventDefault(); // 修复 Android 上点击穿透
        prompt('input name', 'please input your name',
            [
                { text: 'Cancel' },
                {
                    text: 'Submit',
                    onPress: value => new Promise((resolve) => {
                        Toast.info('onPress promise', 1);
                        setTimeout(() => {
                            resolve();
                            console.log(`value:${value}`);
                        }, 1000);
                    }),
                },
            ], 'default', null, ['input your name'])
    }*/

    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }

    onOk = (selectNodes) => {
        debugger;
    }

    standardChange = () => {
        let form = document.getElementById('modal2');
        let values = new Array();
        let tagElements = form.getElementsByTagName('input');
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
            maxGap = Math.max(Math.abs(max - standard), Math.abs(standard - min));
            form.getElementsByClassName('maxGap')[0].value = maxGap;
        } else {
            form.getElementsByClassName('maxGap')[0].value = '';
        }
    }

    reset = (formName) => {
        let form = document.getElementById(formName);
        if(!form) return;
        let tagElements = form.getElementsByTagName('input');
        this.resetInput();
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].value = '';
        }
    }

    addInput = () => {
        let curArr = this.state.inputArr;
        curArr.push(<div key={curArr.length} onChange={this.onChange} style={style5}><input type='number'
                                                                                            style={style3}/></div>);
        this.setState({
            inputArr: curArr
        })
    }

    addInput1 = () => {
        let curArr = this.state.inputArr1;
        curArr.push(<div key={curArr.length} onChange={this.onChange1} style={style5}><input type='number'
                                                                                             style={style3}/></div>);
        this.setState({
            inputArr1: curArr
        })
    }

    addInput2 = () => {
        let curArr = this.state.inputArr2;
        curArr.push(this.getInputRow(curArr.length));
        this.setState({
            inputArr2: curArr
        })
    }

    addInput3 = () => {
        let curArr = this.state.inputArr3;
        curArr.push(this.getDivRow(curArr.length));
        this.setState({
            inputArr3: curArr
        })
    }

    addInput4 = () => {
        let curArr = this.state.inputArr4;
        curArr.push(this.getDivRow2(curArr.length));
        this.setState({
            inputArr4: curArr
        })
    }

    delInput = (index) => {
        let curArr = this.state.inputArr2;
        curArr.splice(index, 1, null);
        this.setState({
            inputArr2: curArr
        })
    }

    delSpan = (index) => {
        let curArr = this.state.inputArr3;
        curArr.splice(index, 1, null);
        this.setState({
            inputArr3: curArr
        })
    }

    delSpan2 = (index) => {
        let curArr = this.state.inputArr4;
        curArr.splice(index, 1, null);
        this.setState({
            inputArr4: curArr
        })
    }

    onWrapTouchStart = (e) => {
        // fix touch to scroll background page on iOS
        if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
            return;
        }
        const pNode = closest(e.target, '.am-modal-content');
        if (!pNode) {
            e.preventDefault();
        }
    }

    render() {
        const {form} = this.props;
        const {inputArr, inputArr1, inputArr2, inputArr3, inputArr4} = this.state;
        const style1 = {
            float: 'left',
            height: 100,
            width: 120,
            border: '1px solid #ccc',
            fontSize: '1.3rem',
            borderRadius: 5,
            color: 'green'
        };
        const style2 = {
            float: 'left',
            height: 100,
            width: 120,
            border: '1px solid #ccc',
            fontSize: '1.3rem',
            borderRadius: 5,
            color: 'red'
        };

        const style4 = {
            margin: '7px 0 0 7px',
            lineHeight: '2.3',
            width: 52,
            display: 'inline-block',
            border: '2px solid #ccc',
            float: 'left',
            backgroundColor: '#eee'
        };

        return (
            <div>
                <SSForm>
                    <SSButton text='弹窗1' onClick={this.onClick('modal1')}/>
                    <SSButton text='弹窗2' onClick={this.onClick('modal2')}/>
                    <SSButton text='弹窗3' onClick={this.onClick('modal3')}/>
                    <SSButton text='获取值' onClick={() => {
                        let form = document.getElementById('modal4');
                        let values = new Array();
                        let tagElements = form.getElementsByTagName('input');
                        for (let i = 0; i < tagElements.length; i++) {
                            values.push(tagElements[i].value);

                        }
                        console.info(values);
                        debugger;
                    }}/>
                    <SSAccordion whiteHeader defaultActiveKey={['01', '02']} openAnimation={{}}>
                        <SSAccordionPanel header="基本信息" key="01">
                        </SSAccordionPanel>
                    </SSAccordion>
                    <SSModal
                        visible={this.state.modal1}
                        transparent
                        maskClosable={true}
                        onClose={this.onClose('modal1')}
                        title="是/否判断法"
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
                    </SSModal>

                    <SSModal
                        visible={this.state.modal2}
                        transparent
                        maskClosable={true}
                        onClose={this.onClose('modal2')}
                        title="基准尺寸偏差测量法"
                        footer={[{
                            text: '重置', onPress: () => {
                                let form = document.getElementById('modal6');
                                let tagElements = form.getElementsByClassName('divRow');
                                for(let i = 0; i< tagElements.length; i++){
                                    if(tagElements[i].id == this.state.curIndex + ''){
                                        tagElements[i].innerHTML = '';
                                    }
                                }
                                this.reset('modal2');
                            }
                        }, {
                            text: '确定', onPress: () => {
                                let form = document.getElementById('modal6');
                                let form2 = document.getElementById('modal2');
                                let tagElements = form.getElementsByClassName('divRow');
                                for(let i = 0; i< tagElements.length; i++){
                                    if(tagElements[i].id == this.state.curIndex + ''){
                                        tagElements[i].innerHTML = form2.getElementsByClassName('maxGap')[0].value;
                                    }
                                }
                                this.onClose('modal2')();
                            }
                        }]}
                        wrapProps={{onTouchStart: this.onWrapTouchStart}}
                    >
                        <div style={{height: 'auto', display: 'inline-block', padding: '0 auto'}}>
                            <form id="modal2">
                                <div style={{
                                    display: 'inline-block',
                                    float: 'left',
                                    width: '20%',
                                    paddingTop: 16,
                                    color: '#000',
                                    fontSize: 12
                                }}>标准值
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: 0,
                                    width: '80%',
                                    marginTop: 8,
                                }}>
                                    <input className='standard' onChange={this.standardChange} style={{
                                        lineHeight: '2.15',
                                        width: 50,
                                        marginLeft: -126,
                                        border: '2px solid #bbb'
                                    }} type='number'/>
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    float: 'left',
                                    width: '20%',
                                    paddingTop: 16,
                                    color: '#000',
                                    fontSize: 12
                                }}>测量值
                                </div>
                                <div style={{
                                    height: 'auto',
                                    display: 'inline-block',
                                    padding: '0 auto',
                                    float: 'left',
                                    width: '80%'
                                }}>
                                    {inputArr1}
                                    <div style={style4} onClick={this.addInput1}><SSIcon icon="icon-stepAdd"/></div>
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    float: 'left',
                                    width: '20%',
                                    paddingTop: 16,
                                    color: '#000',
                                    fontSize: 12
                                }}>最大偏差
                                </div>
                                <div style={{
                                    display: 'inline-block',
                                    padding: 0,
                                    marginLeft: -7,
                                    marginTop: 8,
                                    border: '1px solid #ccc'
                                }}><input className='maxGap' style={{lineHeight: '2.15', width: 170}} type='number' disabled/>
                                </div>
                            </form>
                        </div>
                    </SSModal>

                    <SSModal
                        visible={this.state.modal3}
                        transparent
                        maskClosable={true}
                        onClose={this.onClose('modal3')}
                        title="极差值测量法"
                        footer={[{
                            text: '重置', onPress: () => {
                                this.reset('modal3');
                            }
                        }, {
                            text: '确定', onPress: () => {
                                let form = document.getElementById('modal3');
                                let values = new Array();
                                let tagElements = form.getElementsByTagName('input');
                                for (let i = 0; i < tagElements.length; i++) {
                                    values.push(tagElements[i].value);

                                }
                                console.info(values);
                                debugger;
                                this.onClose('modal3')();
                            }
                        }]}
                        wrapProps={{onTouchStart: this.onWrapTouchStart}}
                    >
                        <form id="modal3">
                            <div style={{
                                display: 'inline-block',
                                float: 'left',
                                width: '20%',
                                paddingTop: 16,
                                color: '#000',
                                fontSize: 12
                            }}>实测值
                            </div>
                            <div style={{
                                height: 'auto',
                                display: 'inline-block',
                                padding: '0 auto',
                                float: 'left',
                                width: '80%'
                            }}>
                                {inputArr}
                                <div style={style4} onClick={this.addInput}><SSIcon icon="icon-stepAdd"/></div>
                            </div>
                            <div style={{
                                display: 'inline-block',
                                float: 'left',
                                width: '20%',
                                paddingTop: 16,
                                color: '#000',
                                fontSize: 12
                            }}>极差值
                            </div>
                            <div style={{
                                display: 'inline-block',
                                padding: 0,
                                marginLeft: -7,
                                marginTop: 8,
                                border: '1px solid #ccc'
                            }}><input className='gap' style={{lineHeight: '2.15', width: 170}} type='number' disabled/>
                            </div>
                        </form>
                    </SSModal>
                    <SSRefer
                        referStyle="tree-list"
                        field="schemeTypeId"
                        icon="icon-Module"
                        iconColor="#ffbf00"
                        label="方案类别"
                        multiMode={true}
                        referCode="0x31"
                        form={form}
                        onOk={this.onOk}
                    />

                    {/*<div style={{padding: '0 auto', marginLeft: 10}}>
                        <form id="modal4">
                            {inputArr2}
                            <div style={{float: 'right', paddingTop: 14, paddingRight: 15}}>
                                <SSIcon size='md' onClick={this.addInput2} color='green' icon="icon-stepAdd"/>
                            </div>
                        </form>
                    </div>*/}

                    {/*<div style={{padding: '0 auto', marginLeft: 10}}>
                        <form id="modal5">
                            {inputArr3}
                            <div style={{float: 'right', paddingTop: 14, paddingRight: 15}}>
                                <SSIcon size='md' onClick={this.addInput3} color='green' icon="icon-stepAdd"/>
                            </div>
                        </form>
                    </div>*/}

                    <div style={{padding: '0 auto', marginLeft: 10}}>
                        <form id="modal6">
                            {inputArr4}
                            <div style={{float: 'right', paddingTop: 14, paddingRight: 15}}>
                                <SSIcon size='md' onClick={this.addInput4} color='green' icon="icon-stepAdd"/>
                            </div>
                        </form>
                    </div>
                </SSForm>
            </div>
        );
    }
}

export default SSForm.create()(NativeDemo);
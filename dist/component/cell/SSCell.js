import React, {Component} from 'react';
import SSIcon from "../icon/SSIcon";
import SSYNModal from "../modal/SSYNModal";
import SSMGModal from "../modal/SSMGModal";
import SSRangeModal from "../modal/SSRangeModal";
import _ from 'lodash';
import SSCellCss from '../../../css/SSCell.css';
import $ from 'jquery';

export default class SSCell extends Component {
    state = {
        cellArr: [],
        showModal: false,
        curIndex: null
    }

    componentWillMount() {
        this.setValues(this.props.values);
    }

    componentWillReceiveProps(nextProps){
        if (nextProps.values !== this.props.values) {
            this.setValues(nextProps.values);
        }
    }

    setValues = (values) => {
        let arr = [];
        let result = [];
        let data = [];
        if(values){
            data = values.slice()
        }
        if (Array.isArray(data) && data.length > 0) {
            if((data.length % 4)>0){
                data.push(...new Array(4 - data.length % 4).fill(''));
            }
            for (let i = 0, len = data.length; i < len; i += 4) {
                result.push(data.slice(i, i + 4));
            }
            result.map((item, index) => {
                arr.push(this.getCellRow(index, item));
            })
        } else {
            // arr.push(this.getCellRow(0, new Array(4).fill('')));
        }
        this.setState({
            cellArr: arr
        })
    }
    onClick = key => (value) => {
        this.setState({
            [key]: true,
            curIndex: value
        });
       this.addClass();
    }
    addClass=()=>{
        window.setTimeout(()=>{
            $('.ModalTop').closest('.am-modal-wrap').addClass('ModalTopStyle');
        },30);
    };

    delCellRow = (index) => {
        if (_.isFunction(this.props.delCellRow)) {
            this.props.delCellRow(index);
        }
       /* let curArr = this.state.cellArr;
        curArr.splice(index, 1, null);
        this.setState({
            cellArr: curArr
        })*/
    }

    getCellRow = (index, rowData) => {
        const {type} = this.props;
        const style1 = {
            margin: '7px 0 0 7px',
            float: 'left',
            border: '1px solid #ccc',
        };

        const style2 = {
            height: 35,
            lineHeight:'33px',
            width: '19vw',
            // border: '1px solid #bbb',
            textAlign: 'center',
            // paddingTop: 4
        };

        const style3 = {
            // width: '12vw',
            paddingTop: 15,
            paddingRight: 10,
            // margin: '0 auto',
            // float: 'right',
        };

        return (<div key={index} style={{height: 45}} className='flexFather'>
            <div>
                {rowData.map((v, i) => {
                    return (
                        <div style={style1} key={index * 4 + i}>
                            <div className='divRow' key={index * 4 + i} id={index * 4 + i}
                                 onClick={this.onClick(type).bind(this, index * 4 + i)} style={_.assign({}, style2, {color: v == '是' ? 'green' : ( v == '否' ? 'red' : '')})}>{v}</div>
                        </div>
                    );
                })}
            </div>
            <div style={style3} onClick={this.delCellRow.bind(this, index)}className='flexSon2'>
                <SSIcon size='md' color='red' icon="icon-jianhao"/>
            </div>
        </div>);
    }

    addCellRow = () => {
        let curArr = this.state.cellArr;
        curArr.push(this.getCellRow(curArr.length, new Array(4).fill('')));
        this.setState({
            cellArr: curArr
        })
    }

    closeModal = key => () => {
        this.setState({
            [key]: false
        });
    }

    mgOk = (maxGap) => {
        let form = document.getElementById('mgCell');
        let tagElements = form.getElementsByClassName('divRow');
        for (let i = 0; i < tagElements.length; i++) {
            if(i<=this.state.curIndex){
                if( tagElements[i].innerHTML==''){
                    tagElements[i].innerHTML = maxGap;
                    break;
                }else {
                    if (tagElements[i].id == this.state.curIndex + '') {
                        tagElements[i].innerHTML = maxGap;
                    }
                }
            }
           /* if (tagElements[i].id == this.state.curIndex + '') {
                tagElements[i].innerHTML = maxGap;
            }*/
        }
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
        this.closeModal('mgCell')();
    }

    rangeOk = (gap) => {
        let form = document.getElementById('rangeCell');
        let tagElements = form.getElementsByClassName('divRow');
        /*for (let i = 0; i < tagElements.length; i++) {
            if (tagElements[i].id == this.state.curIndex + '') {
                tagElements[i].innerHTML = gap;
            }
        }*/
        for (let i = 0; i < tagElements.length; i++) {
            if(i<=this.state.curIndex){
                if( tagElements[i].innerHTML==''){
                    tagElements[i].innerHTML = gap;
                    break;
                }else {
                    if (tagElements[i].id == this.state.curIndex + '') {
                        tagElements[i].innerHTML = gap;
                    }
                }
            }
            /* if (tagElements[i].id == this.state.curIndex + '') {
                 tagElements[i].innerHTML = gap;
             }*/
        }
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
        this.closeModal('rangeCell')();
    }

    mgReset = () => {
        let form = document.getElementById('mgCell');
        let tagElements = form.getElementsByClassName('divRow');
        for (let i = 0; i < tagElements.length; i++) {
            if (tagElements[i].id == this.state.curIndex + '') {
                tagElements[i].innerHTML = '';
            }
        }
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
        this.closeModal('mgCell')();
    }

    rangeReset = () => {
        let form = document.getElementById('rangeCell');
        let tagElements = form.getElementsByClassName('divRow');
        for (let i = 0; i < tagElements.length; i++) {
            if (tagElements[i].id == this.state.curIndex + '') {
                tagElements[i].innerHTML = '';
            }
        }
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
        this.closeModal('rangeCell')();
    }

    ynClick = (flag) => {
        let form = document.getElementById('ynCell');
        let tagElements = form.getElementsByClassName('divRow');
        for (let i = 0; i < tagElements.length; i++) {
            if(i<=this.state.curIndex){
                if( tagElements[i].innerHTML==''){
                    if (flag == 0) {
                        tagElements[i].innerHTML = '否';
                        tagElements[i].style.color = 'red';
                    } else if (flag == 1) {
                        tagElements[i].innerHTML = '是';
                        tagElements[i].style.color = 'green';
                    } else {
                        tagElements[i].innerHTML = '';
                        tagElements[i].style.color = '';
                    }
                    break;
                }else {
                    if (tagElements[i].id == this.state.curIndex + '') {
                        if (flag == 0) {
                            tagElements[i].innerHTML = '否';
                            tagElements[i].style.color = 'red';
                        } else if (flag == 1) {
                            tagElements[i].innerHTML = '是';
                            tagElements[i].style.color = 'green';
                        } else {
                            tagElements[i].innerHTML = '';
                            tagElements[i].style.color = '';
                        }
                    }
                }
            }
            /*if (tagElements[i].id == this.state.curIndex + '') {
                if (flag == 0) {
                    tagElements[i].innerHTML = '否';
                    tagElements[i].style.color = 'red';
                } else if (flag == 1) {
                    tagElements[i].innerHTML = '是';
                    tagElements[i].style.color = 'green';
                } else {
                    tagElements[i].innerHTML = '';
                    tagElements[i].style.color = '';
                }
            }*/
        }
        let values = this.getValues();
        if (_.isFunction(this.props.onChange)) {
            this.props.onChange(values);
        }
        this.closeModal('ynCell')();
    }

    getValues = () => {
        let form = document.getElementById(this.props.type);
        let values = new Array();
        let tagElements = form.getElementsByClassName('divRow');
        for (let i = 0; i < tagElements.length; i++) {
            tagElements[i].innerHTML && values.push(tagElements[i].innerHTML);
        }
        return values;
    }

    render() {
        const {cellArr, mgCell, ynCell, rangeCell} = this.state;
        const {type} = this.props;
        const style1 = {
            paddingTop: 14,
            paddingLeft: 5,
            textAlign:'right',
            paddingRight:10
        };
        return (
            <div className='cell' style={{padding: '0 auto', marginLeft: '5px'}}>
                <form id={type}>
                    {cellArr}
                    <div style={style1} onClick={this.addCellRow}>
                        <SSIcon size='md' color='green' icon="icon-jiahao"/>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </form>
                <SSMGModal show={mgCell} onOk={this.mgOk} onReset={this.mgReset} onClose={this.closeModal(type)}/>
                <SSRangeModal show={rangeCell} onOk={this.rangeOk} onReset={this.rangeReset}
                              onClose={this.closeModal(type)}/>
                <SSYNModal show={ynCell} onYNClick={this.ynClick} onClose={this.closeModal(type)}/>
            </div>
        );
    }
}
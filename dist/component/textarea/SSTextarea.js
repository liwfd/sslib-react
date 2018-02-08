/**
 * Created By Tangjingqi 2017/8/24
 * */
import React, {Component} from 'react';
import {TextareaItem, Icon} from 'antd-mobile/lib/index';
// import PropTypes from 'prop-types';
// import {createForm} from 'rc-form';
import _ from 'lodash';
import SSIcon from '../icon/SSIcon';
import '../../../css/SSTextarea.css';

/*
* title: "备注", //文本域的标题
    icon: 'icon-xingzhuang7',//默认的icon图标
    color: 'green',//font颜色
    inputRow: 3,//文本域默认行数
    placeholder: '请输入你的内容',//默认的值
    editable: true,//是否可以编辑
    disabled: false,//是否禁用
    value: ''
* */
class SSTextarea extends React.Component {
    state = {
        expand: false,
        inputRow: this.props.inputRow,
        stateValue: false,
        maskClass: 'readall_box',
        maskTitle: '展开'
    }

    validateCallBack = (rule, value, callback) => {
        if (_.isFunction(this.props.validateCallBack)) {
            this.props.validateCallBack(rule, value, callback)
            callback()
        } else {
            callback()
        }
    }

    onClick = (value) => {
        if (_.isFunction(this.props.onClick)) this.props.onClick(value)
    }

    onBlur = (value) => {
        this.setState({
            inputRow: value ? Math.ceil(this.getBytesLength(value) / 40) + 1 : 1,
        })
        if (_.isFunction(this.props.onBlur)) this.props.onBlur(value)
    }
    onFocus = (value) => {
        this.setState({
            expand: true,
            inputRow: value ? Math.ceil(this.getBytesLength(value) / 40) + 1 : 3,
        })
        if (_.isFunction(this.props.onFocus)) this.props.onFocus(value);
    }

    onErrorClick = () => {
        if (_.isFunction(this.props.onErrorClick)) this.props.onErrorClick()
    }

    onChange = (value) => {
        //设值到fieldStore
        let fields = {}
        fields[this.props.field] = {
            dirty: true,
            errors: undefined,
            name: this.props.field,
            touched: true,
            validating: true,
            value: value
        };
        this.setState({
            val: value,
            stateValue: true,
            expand: true,
            inputRow: value ? Math.ceil(this.getBytesLength(value) / 40) + 1 : 3,
        })
        this.props.form.setFields(fields);

        if (_.isFunction(this.props.onChange)) this.props.onChange(value)
    }

    expand = () => {
        if (!this.state.expand) {
            this.setState({
                expand: true,
                maskClass: 'readall_center',
                maskTitle: '收起',
                inputRow: this.props.value ? Math.ceil(this.getBytesLength(this.props.value) / 40) + 1 : 3,
            })
        } else {
            this.setState({
                expand: false,
                maskClass: 'readall_box',
                maskTitle: '展开',
                inputRow: 3,
            });
            this.props.form.validateFields((err, data) => {
                let fieldName = this.props.field;
            });
        }
    }

    getBytesLength(str) {
        if (_.isEmpty(str)) {
            return 0;
        } else {
            // 在GBK编码里，除了ASCII字符，其它都占两个字符宽
            return str.replace(/[^\x00-\xff]/g, 'xx').length;
        }
    }

    footerClick = (value) => {
        this.onChange(value);
    }

    getColor = (index) => {
        let rgbList = ['#4169E1', '#EB8E55', '#E3170D', '#A020F0', '#808069', '#32CD32'];
        return rgbList[index % 6];
    }

    componentWillMount() {
        if (this.props.value) {
            if (Math.ceil(this.getBytesLength(this.props.value) / 40) + 1 > 3) {
                this.setState({
                    showMask: true
                })
            } else {
                this.setState({
                    showMask: false
                })
            }
        }
    }

    render() {
        let {val, stateValue, maskClass, inputRow, maskTitle, showMask} = this.state;
        let {
            value, editable, disabled, placeholder, color, icon, form, required,
            trigger, label, field, clear, hasError, count, displayStyle, footerList
        } = this.props;
        let getFieldProps = form ? form.getFieldProps : null;
        if (_.isEmpty(value)) {
            value = '';
        } else {
            value = _.isObject(value) ? value.name : value;
        }
        let style = {
            paddingTop: '10px',
            paddingLeft: '14px',
            paddingBottom: '6px',
            fontSize: '0.34rem',
            backgroundColor: '#fff',
            position: 'relative',
        };
        let boxStyle = {
            paddingLeft: '0'
        };
        let style1 = {
            marginLeft: '0.3rem'
        };
        let style3 = {
            borderBottom: '1px solid #ddd',
            paddingRight: '0.3rem',
            minHeight: '0'
        };
        let errorMsg = '必填项' + label + '未填写';
        let bar = (<div style={style} className='areaHeader'>
            <SSIcon color={color} icon={icon}/>
            <span style={style1}>{label}</span>
            <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
        </div>);
        let footer = (<div className="textarea-footer">
            <div className="textarea-footer-content">
                <div className="textarea-footer-row">
                    {
                        footerList.map((item, index) => {
                            return (<a key={index} style={{
                                borderRadius: '0.3rem',
                                padding: '0 0.2rem',
                                backgroundColor: this.getColor(index),
                                color: '#fff',
                                margin: '0.1rem 0 0 0.1rem'}} onClick={this.footerClick.bind(this, item)}>{item}</a>);
                        })
                    }
                </div>
            </div>
        </div>);

        let mask = (<div className={maskClass}>
            <div className="read_more_mask"></div>
            <a className="showAll" target="_self" onClick={this.expand}>{maskTitle}</a>
        </div>);
        switch (displayStyle) {
            case '2':
                style1.marginLeft = required ? 0 : '0.3rem';
                style.paddingLeft = '0';
                boxStyle.paddingLeft = '0.3rem';
                style3.borderBottom = '0';
                bar = (<div style={style} className='areaHeader2'>
                    <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
                    <span style={style1}>
                        {label}
                    </span>
                </div>);
                break;
            default:
                break
        }
        return (
            <div style={boxStyle}>
                {bar}
                <TextareaItem
                    {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                        initialValue: stateValue ? val : value,
                        rules: [
                            {required, message: errorMsg},
                            {validator: this.validateCallBack},
                        ],
                        valuePropName: 'value',
                        trigger: trigger
                    }) : null}
                    rows={inputRow}
                    count={count}
                    placeholder={disabled ? '' : placeholder}
                    editable={editable}
                    disabled={disabled}
                    onClick={this.onClick}
                    clear={clear}
                    error={hasError}
                    onErrorClick={this.onErrorClick}
                    onBlur={this.onBlur}
                    onFocus={this.onFocus}
                    onChange={this.onChange}
                />
                {disabled && showMask ? mask : null}
                {!disabled ? footer : null}
            </div>
        )
    };
}

SSTextarea.defaultProps = {
    value: '',
    label: '备注', //文本域的标题
    icon: 'icon-xingzhuang7',//默认的icon图标
    color: 'green',//font颜色
    inputRow: 3,//文本域默认行数
    placeholder: '请输入你的内容',//默认的值
    editable: true,//是否可以编辑
    disabled: false,//是否禁用,
    field: '',
    name: '',
    footerList: [],
    clear: true,
    hasError: false,
    count: 0,
    displayStyle: '1'
}
export default SSTextarea;
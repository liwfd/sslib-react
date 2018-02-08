/**
 * Created by Tangjingqi on 2017/8/24.
 */
import React, {Component} from 'react';
import {DatePicker, List} from 'antd-mobile/lib/index';
import _ from 'lodash';
import SSIcon from '../icon/SSIcon';

// import '../../../css/SSDatePicker.css'

class SSDatePicker extends Component {
    state = {
        visible: false
    };

    clearDate = () => {
        //设值到fieldStore
        let fields = {};
        fields[this.props.field] = {
            dirty: true,
            errors: undefined,
            name: this.props.field,
            touched: true,
            validating: true,
            value: null
        }
        this.props.form.setFields(fields);
        this.setState({
            visible: false
        })
    }

    onChange = (date) => {
        //设值到fieldStore
        let fields = {};
        fields[this.props.field] = {
            dirty: true,
            errors: undefined,
            name: this.props.field,
            touched: true,
            validating: true,
            value: date
        }
        this.props.form.setFields(fields);
        this.setState({
            visible: false
        })
        if (_.isFunction(this.props.onChange)) this.props.onChange(date);
    }

    onDismiss = (value) => {
        if (_.isFunction(this.props.onDismiss)) {
            this.props.onDismiss(value);
        } else {
            this.setState({
                visible: false
            })
        }
    }

    validateCallBack = (rule, value, callback) => {
        if (_.isFunction(this.props.validateCallBack)) {
            this.props.validateCallBack(rule, value, callback);
            callback();
        } else {
            callback();
        }
    }

    render() {
        let Item = List.Item;
        let {
            maxDate, mode, minDate, value, arrow, disabled, iconColor, icon, label, form, extra,
            required, trigger, field, format, displayStyle
        } = this.props;

        // let style = {
        //     marginTop: '10px',
        //     marginLeft: '44px',
        //     paddingBottom: '6px',
        //     fontSize: '0.34rem',
        //     // borderBottom: '1PX solid #ddd'
        // }
        let errorMsg = '必填项' + label + '未填写';
        let titleStyle = {
            marginLeft: '0.3rem'
        }

        let getFieldProps = form ? form.getFieldProps : null;
        let dom;
        switch (displayStyle) {
            case '1':
                dom = <div className="dateLine" onClick={() => disabled ? null : this.setState({visible: true})}>
                    <DatePicker
                        {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                            initialValue: new Date(value),
                            rules: [
                                {required, message: errorMsg},
                                {validator: this.validateCallBack},
                            ],
                            trigger: trigger,
                            valuePropName: 'value',
                        }) : null}
                        visible={this.state.visible}
                        onDismiss={this.onDismiss}
                        extra={extra}
                        title={<a style={{color: '#108ee9'}} onClick={this.clearDate}>清除</a>}
                        format={format}
                        minDate={minDate}
                        maxDate={maxDate}
                        use12Hours
                        mode={mode}
                        disabled={disabled}
                        thumb={<SSIcon color={iconColor} icon={icon}/>}
                        onChange={this.onChange}
                    >
                        <Item arrow={disabled ? "empty" : arrow}>
                            <SSIcon color={iconColor} icon={icon}/>
                            <span style={titleStyle}>{label}</span>
                            <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian"
                                                                                    color="red"/></span>
                        </Item>
                    </DatePicker>
                </div>;
                break;
            case '2':
                iconColor = 'red';
                dom = <div className="dateLine" onClick={() => disabled ? null : this.setState({visible: true})}>
                    <DatePicker
                        {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                            initialValue: new Date(value),
                            rules: [
                                {required, message: errorMsg},
                                {validator: this.validateCallBack},
                            ],
                            trigger: trigger,
                            valuePropName: 'value',
                        }) : null}
                        visible={this.state.visible}
                        onDismiss={this.onDismiss}
                        extra={extra}
                        title={<a style={{color: '#108ee9'}} onClick={this.clearDate}>清除</a>}
                        format={format}
                        use12Hours
                        minDate={minDate}
                        maxDate={maxDate}
                        mode={mode}
                        disabled={disabled}
                        thumb={<SSIcon color={iconColor} icon={icon}/>}
                        onChange={this.onChange}
                    >
                        <Item arrow={disabled ? "empty" : arrow}>
                            <span style={{display: required ? '' : 'none'}}><SSIcon icon='icon-bixutian'
                                                                                    color={iconColor}/></span>
                            <span style={{
                                marginLeft: required ? '0' : '0.3rem',
                                marginRight: disabled ? '0.46rem' : ''
                            }}>{label}</span>
                        </Item>
                    </DatePicker>
                </div>;
                break;
            default:
                break;
        }
        return (
            <div>{dom}</div>
        )

    };
};

SSDatePicker.defaultProps = {
    nowDate: new Date().getTime(),
    arrow: 'horizontal',
    listemValue: '日期',
    value: '',
    mode: 'date',//日期选择的类型, 可以是日期date,时间time,日期+时间datetime,年year,月month
    extra: '',
    label: '日期',
    icon: 'icon-xingzhuang',//默认的icon图标
    color: 'red',//font颜色
    disabled: false,
    errorMsg: "",
    required: false,
    field: 'default',
    format: "YYYY-MM-DD",
    displayStyle: '1'
}

export default SSDatePicker;
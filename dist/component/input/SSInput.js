/**
 * Created by hezx on 2017/8/24.
 */
import React, {Component} from 'react';
import {List, InputItem, WhiteSpace} from 'antd-mobile/lib/index';
// import {createForm} from 'rc-form';
// import PropTypes from 'prop-types';
import _ from 'lodash'
import SSIcon from "../icon/SSIcon";
import '../../../css/SSInput.css'
import className from '../../utils/classnames'

const Item = List.Item;

class SSInput extends Component {
    state = {}

    onChange = (value) => {
        //设值到fieldStore
        let fields = {};
        fields[this.props.field] = {
            dirty: true,
            errors: undefined,
            name: this.props.field,
            touched: true,
            validating: true,
            value: value
        }
        this.props.form.setFields(fields);

        if (_.isFunction(this.props.onChange)) this.props.onChange(value);
    }

    onBlur = (value) => {
        if (_.isFunction(this.props.onBlur)) this.props.onBlur(value);
    }
    /* onClick = (value) => {
         if (_.isFunction(this.props.onClick)&&this.props.disabled) this.props.onClick(value);
     }*/
    onFocus = (value) => {
        if (_.isFunction(this.props.onFocus)) this.props.onFocus(value);
    }

    onErrorClick = () => {
        if (_.isFunction(this.props.onErrorClick)) this.props.onErrorClick();
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
        let {
            name, field, required, hasError, editable, disabled, extra, placeholder,
            maxLength, visible, type, label, trigger, clear, form, value, iconColor, icon, showIcon, displayStyle
        } = this.props;
        let getFieldProps = form.getFieldProps;
        let errorMsg = '必填项' + label + '未填写';
        let dom;
        switch (displayStyle) {
            case '1':

                    dom = <Item style={{display: visible ? '' : 'none'}} className="borderBottom">
                        <InputItem
                            {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                                initialValue: value,
                                rules: [
                                    {required, message: errorMsg},
                                    {validator: this.validateCallBack},
                                ],
                                trigger: trigger,
                                valuePropName: 'value',
                            }) : null}
                            editable={editable}
                            disabled={disabled}
                            type={type}
                            extra={extra}
                            name={name}
                            clear={clear}
                            error={hasError}
                            onErrorClick={this.onErrorClick}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                            placeholder={disabled ? '' : placeholder}
                            maxLength={maxLength}
                            onChange={this.onChange}
                        >
                            {showIcon ? <SSIcon color={iconColor} icon={icon}/> : <span style={{marginLeft: '0.3rem'}}></span>}
                            <span style={{marginLeft: '0.3rem'}}>{label}</span>
                            <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
                        </InputItem>
                    </Item>;
                break;
            case '2':
                let cls=className({
                    borderBottom:true,
                    marginRi:true
                });
                iconColor = 'red';
                    dom = <Item style={{display: visible ? '' : 'none'}} className={cls}>
                        <InputItem
                            {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                                initialValue: value,
                                rules: [
                                    {required, message: errorMsg},
                                    {validator: this.validateCallBack},
                                ],
                                trigger: trigger,
                                valuePropName: 'value',
                            }) : null}
                            editable={editable}
                            disabled={disabled}
                            type={type}
                            extra={extra}
                            name={name}
                            clear={clear}
                            error={hasError}
                            onErrorClick={this.onErrorClick}
                            onBlur={this.onBlur}
                            onFocus={this.onFocus}
                            placeholder={disabled ? '' : placeholder}
                            maxLength={maxLength}
                            onChange={this.onChange}
                            style={{paddingRight:'0.46rem'}}
                        >
                            <span style={{display:required?'':'none'}}><SSIcon icon='icon-bixutian' color={iconColor}/></span>
                            <span style={{marginLeft:required?'0':'0.3rem'}}>{label}</span>
                        </InputItem>
                    </Item>
                break;
            default:
                break;
        }
        return(
            <div>{dom}</div>
        )

    }
}

SSInput.defaultProps = {
    form: {},
    label: "",
    name: "",
    type: "text",
    field: "default",
    errorMsg: "请输入必填项!",
    required: false,
    hasError: false,
    editable: true,
    disabled: false,
    value: null,
    extra: "",
    maxLength: 99999999,
    visible: true,
    clear: true,
    trigger: "onChange",
    iconColor: "red",
    icon: "icon-xingzhuang7",
    placeholder: "请输入",
    showIcon: true,
    displayStyle:'1'
}
export default SSInput;

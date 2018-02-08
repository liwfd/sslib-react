/**
 * Created by hezx on 2017/8/24.
 */
import React, { Component } from 'react'
import { List, Picker, WhiteSpace } from 'antd-mobile/lib/index'
// import {createForm} from 'rc-form';
// import PropTypes from 'prop-types';
import _ from 'lodash'
import SSIcon from '../icon/SSIcon'

const Item = List.Item

class SSPicker extends Component {
  state = {
    visible: false
  }

  clearDate = () => {
    //设值到fieldStore
    let fields = {}
    fields[this.props.field] = {
      dirty: true,
      errors: undefined,
      name: this.props.field,
      touched: true,
      validating: true,
      value: null
    }
    this.props.form.setFields(fields)
    this.setState({
      visible: false
    })
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
    }
    this.props.form.setFields(fields)

    if (_.isFunction(this.props.onChange)) this.props.onChange(value[0])
  }

  onOk = (value) => {
    if (_.isFunction(this.props.onOk)) {
      this.setState({
        visible: false
      })
      this.props.onOk(value[0])
    } else {
      this.setState({
        visible: false
      })
    }
  }

  onDismiss = (value) => {
    if (_.isFunction(this.props.onDismiss)) {
      this.props.onDismiss(value)
    } else {
      this.setState({
        visible: false
      })
    }
  }

  validateCallBack = (rule, value, callback) => {
    if (_.isFunction(this.props.validateCallBack)) {
      this.props.validateCallBack(rule, value, callback)
      callback()
    } else {
      callback()
    }
  }

  render () {
    const {
      label, field, data, required, errorMsg, disabled, extra, visible,
      trigger, form, value, iconColor, icon,displayStyle
    } = this.props
    let getFieldProps = form ? form.getFieldProps : null
    let dom
    switch (displayStyle){
      case '1':
        dom = <div onClick={() => disabled ? null : this.setState({visible: true})}>
          <Picker style={{display: visible ? '' : 'none'}} data={data}
                  extra={extra}
                  title={<a style={{color: '#108ee9'}} onClick={this.clearDate}>清除</a>}
                  cols={1}
                  visible={this.state.visible}
                  disabled={disabled}
                  onChange={this.onChange}
                  onOk={this.onOk}
                  onDismiss={this.onDismiss}
                  {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                    initialValue: value,
                    rules: [
                      {required, message: errorMsg},
                      {validator: this.validateCallBack},
                    ],
                    trigger: trigger,
                    valuePropName: 'value',
                  }) : null}
          >
            <List.Item arrow={disabled ? 'empty' : 'horizontal'}>
              <SSIcon color={iconColor} icon={icon}/>
              <span style={{marginLeft: '0.3rem'}}>{label}</span>
              <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
            </List.Item>
          </Picker>
        </div>
        break
      case '2':
        dom = <div className={'required'} onClick={() => disabled ? null : this.setState({visible: true})}>
          <Picker style={{display: visible ? '' : 'none'}} data={data}
                  extra={extra}
                  title={<a style={{color: '#108ee9'}} onClick={this.clearDate}>清除</a>}
                  cols={1}
                  visible={this.state.visible}
                  disabled={disabled}
                  onChange={this.onChange}
                  onOk={this.onOk}
                  onDismiss={this.onDismiss}
                  {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                    initialValue: value,
                    rules: [
                      {required, message: errorMsg},
                      {validator: this.validateCallBack},
                    ],
                    trigger: trigger,
                    valuePropName: 'value',
                  }) : null}
          >
            <List.Item arrow={disabled ? 'empty' : 'horizontal'}
                       thumb={required ? <SSIcon icon="icon-bixutian" color="red"/> : <span style={{marginLeft: '0.3rem'}}></span>}>
              {label}
            </List.Item>
          </Picker>
        </div>
        break
    }
    return (
      <div>{dom}</div>
    )
  }
}

SSPicker.defaultProps = {
  form: {},
  label: '',
  field: 'default',
  errorMsg: '请输入必填项!',
  required: false,
  disabled: false,
  value: null,
  extra: '',
  visible: true,
  trigger: 'onChange',
  iconColor: 'red',
  icon: 'icon-xingzhuang7',
  displayStyle: '1',
}
export default SSPicker

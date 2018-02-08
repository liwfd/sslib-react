/**
 * Created By TANGJQ 2017/8/30
 * */
import React, { Component } from 'react'
import { List, Stepper } from 'antd-mobile/lib/index'
import SSIcon from '../icon/SSIcon'
import _ from 'lodash'

class SSStepper extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      val: 0,
      val1: 2,
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

    if (_.isFunction(this.props.onChange)) this.props.onChange(value)
  }

  render () {
    const {
      showNumber, field, max, min, step, defaultValue, errorMsg, required, trigger, value, form, icon, color,
      disabled, label, marginleft, width, minWidth, background,displayStyle
    } = this.props
    let Item = List.Item
    let getFieldProps = form ? form.getFieldProps : null
    let style1 = {width: width, minWidth: minWidth, backgroundColor: background}
    let style2 = {marginLeft: marginleft}
    let dom
    switch (displayStyle){
      case '1':
        dom = <Item
          extra={
            <Stepper
              {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                initialValue: value,
                rules: [
                  {required, message: errorMsg},
                  {validator: this.validateCallBack},
                ],
                trigger: trigger,
                valuePropName: 'value',
              }) : null}
              style={style1}
              showNumber={showNumber}
              max={max}
              disabled={disabled}
              min={min}
              step={step}
              defaultValue={defaultValue}
              onChange={this.onChange}
            />}
        >
          <SSIcon icon={icon} color={color}></SSIcon>
          <span style={style2}>{label}</span>
          <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
        </Item>
        break
      case '2':
        dom = <div className={'required'}>
          <Item
            extra={
              <Stepper
                {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                  initialValue: value,
                  rules: [
                    {required, message: errorMsg},
                    {validator: this.validateCallBack},
                  ],
                  trigger: trigger,
                  valuePropName: 'value',
                }) : null}
                style={style1}
                showNumber={showNumber}
                max={max}
                disabled={disabled}
                min={min}
                step={step}
                defaultValue={defaultValue}
                onChange={this.onChange}
              />}
            thumb={required ? <SSIcon icon="icon-bixutian" color="red"/> : <span style={{marginLeft: '0.3rem'}}></span>}
          >
            {/*<span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>*/}
            {label}
            {/*<span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>*/}
          </Item>
        </div>
        break
    }
    return (
      <div>{dom}</div>
    )
  }
}
SSStepper.defaultProps = {
  width: '50%',
  field: 'default',
  minWidth: '2rem',
  label: '',//左边文字
  min: 0,//最小值
  max: Infinity,//最大值
  icon: 'icon-N',//图标
  color: 'green',//font颜色
  showNumber: true,
  marginleft: '0.3rem',
  defaultValue: 1,
  step: 1,
  value: 0,
  errorMsg: '',
  required: false,
  disabled: false,
  displayStyle: '1',
}
export default SSStepper
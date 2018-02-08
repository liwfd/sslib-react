/**
 * Created by fuyu on 2017/8/24.
 */
import React, { Component } from 'react'
import { List, Switch } from 'antd-mobile/lib/index'
import _ from 'lodash'
import SSIcon from '../icon/SSIcon'

const Item = List.Item

class SSSwitch extends Component {
  state = {
    checked: !!this.props.value
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.value !== this.state.checked && _.isFunction(this.props.onChange)) {
      this.setState({
        checked: nextProps.value
      })
    }
  }

  onChange = (flag) => {
      //设值到fieldStore
      let fields = {};
      fields[this.props.field] = {
          dirty: true,
          errors: undefined,
          name: this.props.field,
          touched: true,
          validating: true,
          value: flag
      }
      this.props.form.setFields(fields);
    if (_.isFunction(this.props.onChange)) this.props.onChange(flag)
    this.setState({
          checked: flag
      })
  }

  render () {
    const {form, value, label, icon, iconColor, disabled, field, checkedText, unCheckedText, displayStyle, required} = this.props
    let getFieldProps = form ? form.getFieldProps : null
    let dom
    switch (displayStyle) {
      case '1':
        dom = <Item
          extra={<div><span style={{color: '#4dd865', marginRight: '0.1rem'}}>{this.state.checked ? checkedText : unCheckedText}</span><Switch
            {..._.isFunction(getFieldProps) ? getFieldProps(field, {
              initialValue: this.state.checked,
              valuePropName: 'checked',
            }) : null}
            onClick={this.onChange}
            platform="cross"
            checked={this.state.checked}
            disabled={disabled}
          /></div>}
          thumb={<SSIcon color={iconColor} icon={icon}/>}
        >{label}
          <span style={{display: required ? '' : 'none'}}><SSIcon icon="icon-bixutian" color="red"/></span>
        </Item>
        break
      case '2':
        dom = <div className={'required'}>
          <Item
            extra={<div><span style={{color: '#4dd865', marginRight: '0.1rem'}}>{this.state.checked ? checkedText : unCheckedText}</span><Switch
              {..._.isFunction(getFieldProps) ? getFieldProps(field, {
                initialValue: this.state.checked,
                valuePropName: 'checked',
              }) : null}
              onClick={this.onChange}
              platform="cross"
              checked={this.state.checked}
              disabled={disabled}
            /></div>}
            thumb={required ? <SSIcon icon="icon-bixutian" color="red"/> : <span style={{marginLeft: '0.3rem'}}></span>}
          >{label}</Item>
        </div>
        break
      default:
        break
    }
    return (
      <div>
        {dom}
      </div>
    )
  };
}

SSSwitch.defaultProps = {
  label: '',
  icon: 'icon-xingzhuang9',
  color: 'green',
  value: true,
  showIcon: true,
  field: '',
  disabled: false,
  checkedText: '',
  unCheckedText: '',
  displayStyle: '1',
  required: false,
}
export default SSSwitch

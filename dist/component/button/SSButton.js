/**
 * Created by ByChan on 2017.8.29.
 */
import React from 'react'
import { Button, Flex, WingBlank } from 'antd-mobile/lib/index'
import PropTypes from 'prop-types'
import SSIcon from '../icon/SSIcon'
import '../../../css/SSButton.css'
import classNames from 'classnames'
import { hashHistory } from 'react-router'

/*
* SSButton组件
* type
*   fill :项目里面一整行的绿色图标   可以传递fix 固定在页面底部
*   center :项目里面两翼留白的绿色图标
*   dashed :项目里面的蓝色虚线图标
*   add : 所有列表页的圆形增加图标(已加上定位)
*   saveDel　: 单行两个图标，下面有详细说明
*
* text
*   单个按钮上面的文字  默认为保存  type为add和saveDel时不用传
*
* onClick
*   单个按钮点击事件
*
*当type为saveDel和footer时：可以传递lClick,rClick,lText,rText
*   rClick   rText   右边按钮的文字和函数  text默认为保存
*   cClick   cText   左边按钮的文字和函数  text默认为删除
*   lClick   lText   左边按钮的文字和函数  text默认为取消
*
*disabled   控制按钮不可点击，颜色置灰，单个按钮加disabled   多个为 ldisabled  cdisabled rdisabled  使用同上
*
* */
export default class SSButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    type: PropTypes.string,
    text: PropTypes.string,
    onClick: PropTypes.func,
    rClick: PropTypes.func,
    lClick: PropTypes.func,
    rText: PropTypes.string,
    lText: PropTypes.string,
    cText: PropTypes.string,
    icon: PropTypes.string,
  }

  static defaultProps = {
    type: 'fill',
    text: '保存',
    onClick: () => {return false},
    rClick: () => {return false},
    cClick: () => {return false},
    lClick: () => {
      hashHistory.goBack()
    },
    rText: '保存',
    lText: '取消',
    cText: '删除',
    fix: 0,
    disabled: 0,
    ldisabled: 0,
    cdisabled: 0,
    rdisabled: 0,
    icon: 'icon-Add',
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  render () {
    let children
    let {type, text, onClick, rClick, lClick, rText, lText, cText, style,disabled, fix, ldisabled, cdisabled, rdisabled, cClick,icon} = this.props
    let newAddStyle = {
      color:'#898989',
      ...style
    }
    switch (type) {
      case 'fill':
        children = <Button
          className={classNames({'pjtGreenBtn': 1, 'no_radius': 1, 'fix_btn': fix, 'disabledStyle': disabled})}
          activeStyle={false}
          type="primary"
          style={this.props.style}
          onClick={disabled ? '' : onClick}>
          {text}
        </Button>
        break
      case 'center':
        children = <WingBlank size='sm'>
          <Button
            className={classNames({'pjtGreenBtn': 1, 'disabledStyle': disabled})}
            style={style}
            type="primary"
            onClick={disabled ? '' : onClick}>
            {text}
          </Button>
        </WingBlank>
        break
      case 'fixCenter':
        children = <div onClick={onClick} className='fix_center_btn'>
          <Button style={style}
                  className={classNames({'pjtRedBtn': 1, 'disabledStyle': disabled})}
                  activeStyle={false}
                  type="primary"
          >{text}</Button>
        </div>
        break
      case 'dashed':
        children = <WingBlank size={'lg'}>
          <Button
            className={'dottedBtn'}
            style={this.props.style}
            activeStyle={false}
            type="ghost"
            onClick={onClick}>
            {text}
          </Button>
        </WingBlank>
        break
      case 'add':
        children = <div className='add_btn' onClick={onClick}>
          <SSIcon icon='icon-Add' color='#ffffff'></SSIcon>
        </div>
        break
      case 'newAdd':
        children = <div onClick={onClick} className='fix_newAdd_btn'>
          <Button style={newAddStyle} icon={require('../../../svg/' + icon + '.svg')}>{text}</Button>
        </div>
        break
      case 'left-right':
        children = <WingBlank size={'lg'}>
          <Flex>
            <Flex.Item>
              <Button
                className={classNames({'pjtPompadourBtn': 1, 'disabledStyle': ldisabled})}
                activeStyle={false}
                type="primary"
                style={this.props.lStyle}
                onClick={ldisabled ? '' : lClick}>
                {lText}
              </Button>
            </Flex.Item>
            <Flex.Item>
              <Button
                style={this.props.rStyle}
                className={classNames({'pjtGreenBtn': 1, 'disabledStyle': rdisabled})}
                activeStyle={false}
                type="primary"
                onClick={rdisabled ? '' : rClick}>
                {rText}
              </Button>
            </Flex.Item>
          </Flex>
        </WingBlank>
        break
      case 'footer':
        children = <div style={style} className={classNames({'footer_btn': 1, 'fix_btn': 1})}>
          <div>
            <span onClick={ldisabled?'':lClick}
                  className={classNames({'disabledStyle2': ldisabled,'foot1btn':1})}>
              <SSIcon
                icon={'icon-bohui'}
                color={ldisabled ? '#808080' : '#19AF19'}></SSIcon>
              <span style={{marginLeft:'5px'}}>{lText}</span>
              </span>
            <span onClick={cdisabled?'':cClick}
                  className={classNames({'disabledStyle2': cdisabled,'foot2btn':1})}>
              <SSIcon
                icon={'icon-shanchu1'}
                color={cdisabled ? '#808080' : '#FA503C'}></SSIcon>
              <span style={{marginLeft:'5px'}}>{cText}</span>
              </span>
          </div>
          <span className={classNames({'right_btn': 1, 'disabledStyle': rdisabled})} onClick={rdisabled ? '' : rClick}>{rText}</span>
        </div>
        break
      default:
        break
    }
    return (
      <div>
        {children}
      </div>
    )
  }
}
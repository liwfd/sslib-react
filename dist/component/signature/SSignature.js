import React, { Component } from 'react'
import $ from 'jquery'
import SSButton from '../button/SSButton'
import { WhiteSpace, Toast, Modal, Popup } from 'antd-mobile/lib/index'
import PropTypes from 'prop-types'
import _ from 'lodash'
import ajax from '../../utils/ajax'
import BaseHost from '../../utils/BaseHost'
import UploadFileUtils from '../../utils/UploadFileUtils'
//上传url
var uploadUrl = '/icop-file/file/muploadx'
var ADDR = BaseHost.ADDR
const alert = Modal.alert
//let originalImg='';//用于存放单据未保存时，上传的图片地址
/*
 * 签名板：
 * 说明：当需要展示签名的图片时需要传imgUrl
 *
 *
 *
 * */
export default class SSignature extends Component {
  state = {
    imgs: '',
    lineColor: '#000',
    lineWidth: 2,
    height: this.props.height,
    autoFit: false,
  }

  componentWillMount () {
    //绘制的过程中平滑过渡
    window.requestAnimFrame = (function (callback) {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimaitonFrame ||
        function (callback) {
          window.setTimeout(callback, 1000 / 60)
        }
    })()

  };

  componentWillReceiveProps (nextProps) {
    console.log(nextProps, 'next')
    if (nextProps.disabled) {
      this.loadAttachList(nextProps.source)

    }
  }

  componentDidMount () {
    this.loadAttachList(this.props.source)
    if (!this.props.disabled) {
      this.signature()
    }

  }

  _renderCanvas = () => {
    if (this.drawing) {
      this.ctx.moveTo(this.lastPos.x, this.lastPos.y)
      this.ctx.lineTo(this.currentPos.x, this.currentPos.y)
      this.ctx.stroke()
      this.lastPos = this.currentPos
    }
  }
  _resetCanvas = () => {
    this.ctx = this.canvas.getContext('2d')
    this.ctx.strokeStyle = this.state.lineColor
    this.ctx.lineWidth = this.state.lineWidth
    this.ctx.fillStyle = '#fff'
    this.ctx.fillRect(0, 0, $('.signature').width(), this.props.height)

  }
  _resizeCanvas = () => {
    let width = this.$element.outerWidth()
    this.$canvas.attr('width', width)
    this.$canvas.css('width', width + 'px')
  }

  loadAttachList (source) {
    let params = {
      id: source.sourceId,
      billType: source.billType,
      type: source.sourceType
    }
    let that = this
    if (source.sourceId && source.sourceType && source.billType) {
      UploadFileUtils.loadAttachList(params, (fileList) => {
        if (!_.isEmpty(fileList[0])) {
          that.setState({
            imgPath: fileList[0].fileUrl,
            files: fileList
          })

        }
      })
    } else {
      that.setState({
        imgPath: this.props.imgUrl
      })
    }
  }

  signature = () => {
    this.$element = $('.signature')
    this.canvas = false
    this.$canvas = false
    this.ctx = false
    this.drawing = false
    this.currentPos = {
      x: 0,
      y: 0
    }
    this.lastPos = this.currentPos
    this.init()
  }
  //关闭签名弹窗
  closeSign = () => {
    if (_.isFunction(this.props.onClose)) {
      this.props.onClose()
    }
  }
  //删除签名
  delSign = () => {
    let that = this
    const alertInstance = alert('删除', '删除后不可恢复!', [
      {
        text: '取消', onPress: () => {
          alertInstance.close()
        }, style: 'default'
      },
      {
        text: '确定', onPress: () => {
          let {sourceId, billType, sourceType} = this.props.source
          if (!sourceId) {
            setTimeout(() => {
              this.setState({
                imgPath: ''
              })
              that.signature()
            }, 20)
            if (_.isFunction(this.props.delSign)) {
              this.props.delSign(true)
            }
            return
          }
          let params = {
            id: sourceId,
            billType: billType,
            sourceType: sourceType,
            attachIds: this.state.files[0].gid
          }
          UploadFileUtils.delAttach(params, () => {
            //删除成功的回调
            /*that.loadAttachList(this.props.source)*/
            that.setState({
              imgPath: ''
            })
            if (_.isFunction(this.props.delSign)) {
              this.props.delSign(true)
            }
            that.signature()
          })

        }
      },
    ])
  }
  renderBtn = () => {
    let delBtn = this.props.showDelBtn
    let closeBtn = this.props.showCloseBtn
    let type = delBtn && closeBtn ? 'left-right' : 'center'
    let text = delBtn ? '删除' : closeBtn ? '关闭' : ''
    return delBtn || closeBtn ? (<div><WhiteSpace size="xl" style={{backgroundColor: '#EFEFF4'}}/><SSButton
      type={type}
      text={text}
      rText='删除'
      rClick={this.delSign}
      lClick={this.closeSign}
      lText='关闭'
      style={{backgroundColor: '#FA503C'}}
      onClick={delBtn ? this.delSign : this.closeSign}
    /></div>) : null
  }
  init = () => {
    // Set up the canvas
    let width = $('.signature').width()
    this.clear = true
    this.$canvas = $(this.refs.sign)
    this.$canvas.attr({
      width: width,
      height: this.state.height
    })
    this.$canvas.css({
      boxSizing: 'border-box',
      height: this.state.height + 'px',
      position: 'relative',
      zIndex: 100
    })
    // Fit canvas to width of parent
    if (this.state.autoFit === true) {
      this._resizeCanvas()

    }
    this.canvas = this.$canvas[0]
    this._resetCanvas()

    this.$canvas.on('mousedown touchstart', (e) => {

      /* this.setState({
           display: 'none'
       });*/
      this.drawing = true
      this.lastPos = this.currentPos = this._getPosition(e)
    })
    /*   this.$canvas.on('mousemove touchmove', $.proxy(function(e) {
     this.currentPos = this._getPosition(e);
     }, this));*/
    this.$canvas.on('mousemove touchmove', (e) => {
      this.currentPos = this._getPosition(e)
      this.signed = true
    })

    this.$canvas.on('mouseup touchend', (e) => {
      this.drawing = false

      /*var changedEvent = $.Event('jq.signature.changed');
       this.$element.trigger(changedEvent);*/
    })
    $(document).on('touchstart touchmove touchend', (e) => {

      if (e.target === this.canvas) {
        e.preventDefault()
      }
    })

    /*      this.hintText()*/

    // Start drawing
    var that = this;
    (function drawLoop () {
      window.requestAnimFrame(drawLoop)
      that._renderCanvas()
    })()
  }
  /*hintText = () => {
   let ctx = this.canvas.getContext("2d");
   ctx.font="15px Arial";
   ctx.fillText("请在这里签字...", 20, 25, 320);

   };*/

  _getPosition = (event) => {
    let xPos, yPos, rect
    rect = this.canvas.getBoundingClientRect()
    event = event.originalEvent
    // Touch event
    if (event.type.indexOf('touch') !== -1) { // event.constructor === TouchEvent
      xPos = event.touches[0].clientX - rect.left
      yPos = event.touches[0].clientY - rect.top
    }
    else {
      xPos = event.clientX - rect.left
      yPos = event.clientY - rect.top
    }
    return {
      x: xPos,
      y: yPos
    }
  }
  clearCanvas = () => {
    this.canvas.width = this.canvas.width
    this._resetCanvas()
    this.signed = false
    /*this.setState({
        display: 'inline-block'
    })*/
  }
  getDataURL = () => {
    return this.canvas.toDataURL()
  }
  upLodeFile = (params) => {

    let that = this
    ajax.postJSON(ADDR + uploadUrl, params, function (data) {
      let backData = data.backData
      if (data.success) {
        Toast.success(data.backMsg ? data.backMsg : '保存成功!', 1)
        /*let originalUrl=`${ADDR}/${backData[0].filePath}`;
        originalImg=originalUrl;*/

      } else {
        Toast.fail(data.backMsg ? data.backMsg : '保存失败!', 1)
      }
      if (_.isFunction(that.props.saveData)) {
        backData && backData.map(v => v.originalUrl = ADDR + '/' + UploadFileUtils.zoomImgPath(v.filePath))
        that.props.saveData(data)
      }
    })
  }

  saveData = () => {
    /* UploadFileUtils.zipImg(this.getDataURL(), {}, (dataUrl) => {
     if(!this.signed){
     Toast.fail('您还没有签字!',1);
     return;
     }

     if (_.isFunction(this.props.saveData)) this.props.saveData(dataUrl)
     })*/
    if (!this.signed) {
      Toast.fail('您还没有签字!', 1)
      return
    }
    let params = this.props.source
    console.log(params, 'source')
    let content = this.getDataURL().replace('data:image/png;base64,', '').replace('data:image/jpeg;base64,', '')

    params.files = [
      {
        fileName: `${params.sourceType}.jpg`,
        fileContent: content
      }
    ]
    let multipleSign = this.props.multipleSign
    if (multipleSign) {
      params.files.fileName = this.props.source && this.props.source.sourceType ? this.props.source.sourceType + '_' + new Date().getTime() + '.jpg' : 'attach_' + new Date().getTime() + '.jpg'
      this.props.saveData(multipleSign, params)
      return
    }
    this.upLodeFile(params)

  }

  render () {
    let {disabled, imgUrl, multipleSign, height} = this.props
    let {imgPath} = this.state
    let spanStyle = {
      display: 'block',
      position: 'absolute',
      left: '10px',
      top: 0,
      height: '30px',
      lineHeight: '30px',
      fontWeight: 'bold',

    }
    return (
      !multipleSign && (disabled || imgPath) ? (<div><WhiteSpace size="xl" style={{backgroundColor: '#EFEFF4'}}/>
        <img style={{width: '100vw', backgroundColor: '#fff', height: `${height}px`}} src={imgUrl || imgPath} alt=""/>
        {this.renderBtn()}
      </div>) : (<div>
        <div className="signature" style={{backgroundColor: '#fff', position: 'relative'}}>
          <span style={spanStyle}>请在下方空白区域签字</span>
          <WhiteSpace style={{backgroundColor: '#EFEFF4', height: '30px'}}/>
          <canvas ref="sign"></canvas>
          <WhiteSpace size="xl" style={{backgroundColor: '#EFEFF4'}}/>
        </div>
        <SSButton
          type='left-right'
          lText='清除'
          lClick={this.clearCanvas}
          rClick={this.saveData}
        />
      </div>)
    )
  }
}

SSignature.propTypes = {
  saveData: PropTypes.func,
  imgUrl: PropTypes.string,
  disabled: PropTypes.bool,
  showCloseBtn: PropTypes.bool,
  showDelBtn: PropTypes.bool,
  onClose:PropTypes.func.isRequired,
}

SSignature.defaultProps = {
  imgUrl: '',
  disabled: false,
  showDelBtn: false,//默认不显示删除按钮
  showCloseBtn: true,//默认显示关闭按钮
  height: 320,//画布默认高度
}

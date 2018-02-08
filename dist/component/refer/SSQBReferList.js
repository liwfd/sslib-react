import React, { Component } from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import ajax from '../../utils/ajax'
import { LoadMore } from 'react-weui'
import {
  List,
  Checkbox,
  SearchBar,
  WhiteSpace,
  Pagination,
  Toast,
  Popup,
  Radio,
  ActivityIndicator
} from 'antd-mobile/lib/index'
import '../../../css/SSReferList.css'
import RestUrl from '../../common/RestUrl'
import SSNavBar from '../navbar/SSNavBar'
import { hashHistory } from 'react-router'
import SSList from '../list/SSList'
import SSTab from '../tab/SSTab'
import YYPlusUtils from '../../utils/YYPlusUtils'

const Item = List.Item
let CheckboxItem = Checkbox.CheckboxItem
let RadioItem = Radio.RadioItem
let page

class SSQBReferList extends Component {
  componentWillMount () {
    page = this
    // window.addEventListener('hashchange', (hash) => {
    //     let oldUri = hash.oldURL.split('#/')[1].split('?')[0];
    //     if (oldUri.endsWith('/refer')) {
    //         this.props.onClose();
    //     }
    // })
    window.addEventListener('backbutton', () => {
      let hash = window.location.hash.split('?')[0]
      if (hash.endsWith('/refer')) {
        this.props.onClose()
      }
    })
    let referCode = this.props.referCode
    //根据参照编码获取参照信息
    ajax.getJSON(RestUrl.REF_SERVER_URL + RestUrl.GET_REFINFO_BYCODE, {refCode: referCode}, function (result) {
      if (result.success) {
        let referUrl = result.data.dataurl
        let referParams = {}
        referParams.condition = page.props.condition
        if (page.props.displayStyle === '2') {
          referParams.pageSize = 20
          page.setState({
            pageNumber: 1
          })
        }
        page.setState({
          referName: result.data.refName,
          referUrl: referUrl,
          params: referParams,
        })

        page.getListData(referUrl, referParams, 1)
      } else {
        Toast.fail('请检查参照编码!', 3)
      }

    }, function (err) {
      Toast.fail('服务器通讯异常!', 3)
    })
  }

  componentDidMount () {
    if (this.props.displayStyle === '2') {
      let referList = document.querySelector('.referList-content')
      referList.addEventListener('touchstart', this.ts = (e) => {
        this.tsPageY = e.touches[0].pageY
      })
      referList.addEventListener('touchmove', this.tm = (e) => {
        this.tmPageY = e.touches[0].pageY

      })
      referList.addEventListener('scroll', this.src = (e) => {
        let contentHeight = document.querySelector('.referList-content .am-list-body').clientHeight
        let referHeight = referList.clientHeight
        let scrollTop = referList.scrollTop
        let scrollPercent = Math.floor(((scrollTop + referHeight) / contentHeight) * 100)
        let moveY = this.tmPageY - this.tsPageY

        if (this.state.banLoad || this.state.finish || scrollTop <= 0 || moveY >= 0) return
        if (scrollPercent >= this.props.triggerPercent) {
          this.setState({
            loading: true
          })

          this.onLoadMore(this.resolveLoading, this.finish)

        }

      })

    }

  }

  componentWillUnmount () {
    if (this.props.displayStyle === '2') {
      document.querySelector('.referList-content').removeEventListener('touchstart', this.ts)
      document.querySelector('.referList-content').removeEventListener('touchmove', this.tm)
      document.querySelector('.referList-content').removeEventListener('scroll', this.src)
    }
  }

  state = {
    data: [],
    selectedId: null,
    pageNumber: 0,
    selectedNode: {},
    selectedNodes: [],
    animating: false,
    ListData: []
  }
  finish = () => {
    this.setState({
      finish: true,
      loading: false
    })
  }
  resolveLoading = () => {
    this.setState({
      finish: false
    })
  }
  onLoadMore = (resolve, finish) => {
    if (this.state.data.length === this.state.count) {
      finish()
    } else {
      let referUrl = this.state.referUrl
      let referParams = {}
      referParams.condition = this.props.condition
      let number = this.state.pageNumber
      let index = number > 1 ? number + 1 : number + 2
      this.setState({
        pageNumber: index,
        params: referParams
      })

      this.getMoreData(referUrl, referParams, index)
      resolve()

    }
  }

  //下拉加载时调用
  getMoreData (referUrl, referParams, pageNumber) {
    page.setState({
      banLoad: true,
    })
    if (this.props.ajaxType == 'post') {
      ajax.postJSON(referUrl, _.assign({}, referParams, {pageNumber: pageNumber}), function (result) {
        page.setState({
          banLoad: false,
        })
        if (result.code === 'success') {
          page.setState({
            data: page.state.data.concat(result.data.content),

          })
        } else {
          Toast.fail(result.backMsg, 1)
        }
      }, function (err) {
        page.setState({
          banLoad: false,
        })
        Toast.fail('服务器通讯异常!', 1)
      })
    } else {
      ajax.getJSON(referUrl, _.assign({}, referParams, {pageNumber: pageNumber}), function (result) {
        page.setState({
          banLoad: false,
        })
        if (result.code === 'success') {
          page.setState({
            data: page.state.data.concat(result.data.content),
          })
        } else {
          Toast.fail(result.backMsg, 1)
        }
      }, function (err) {
        page.setState({
          banLoad: false,
        })
        Toast.fail('服务器通讯异常!', 1)
      })
    }
  }

  getListData (referUrl, referParams, pageNumber) {
    this.setState({
      animating: true
    })

    if (this.props.ajaxType == 'post') {
      ajax.postJSON(referUrl, _.assign({}, referParams, {pageNumber: pageNumber}), function (result) {
        if (result.code === 'success') {
          page.setState({
            data: result.data.content,
            pageCount: result.data.pageCount,
            animating: false,
            count: result.data.count
          })
        } else {
          page.setState({
            animating: false
          })
          Toast.fail(result.backMsg, 1)
        }
      }, function (err) {
        page.setState({
          animating: false
        })
        Toast.fail('服务器通讯异常!', 1)
      })
    } else {
      ajax.getJSON(referUrl, _.assign({}, referParams, {pageNumber: pageNumber}), function (result) {
        if (result.code === 'success') {
          page.setState({
            data: result.data.content,
            pageCount: result.data.pageCount,
            animating: false,
            count: result.data.count
          })
        } else {
          page.setState({
            animating: false
          })
          Toast.fail(result.backMsg, 1)
        }
      }, function (err) {
        page.setState({
          animating: false
        })
        Toast.fail('服务器通讯异常!', 1)
      })
    }
  }

  onMultiChange = (selectedNode) => {
    //多选模式

    let selectedNodes = this.state.selectedNodes
    if (!selectedNodes.some((item) => {
        return item.id === selectedNode.id
      })) {
      selectedNodes.push(selectedNode)
      this.setState({
        selectedNodes: selectedNodes
      })
    } else {
      let newNodes = []
      // eslint-disable-next-line
      selectedNodes.map((item) => {
        if (item.id !== selectedNode.id) {
          newNodes.push(item)
        }
      })
      this.setState({
        selectedNodes: newNodes
      })
    }
  }

  onSingleChange = (selectedNode) => {
    //单选模式
    if (selectedNode.id === this.state.selectedId) {
      this.setState({
        selectedId: null,
        selectedNode: {}
      })
    } else {
      this.setState({
        selectedId: selectedNode.id,
        selectedNode: selectedNode
      })
    }
  }

  onOk = () => {
    if (this.props.onOk && _.isFunction(this.props.onOk)) {
      if (!this.props.multiMode) {
        this.props.onOk(this.state.selectedNode)
      } else {
        this.props.onOk(this.state.selectedNodes)
      }
    }
  }

  onClose = () => {
    this.props.onClose()
    hashHistory.goBack()
  }

  onSearchSubmit = (value) => {
    let referUrl = this.state.referUrl
    let referParams = {}
    referParams.searchText = value
    referParams.condition = this.props.condition
    this.setState({
      params: referParams
    })
    this.getListData(referUrl, referParams, 1)
  }

  onChangePageNumber = (value) => {
    this.setState({
      pageNumber: value
    })
    let referUrl = this.state.referUrl
    let referParams = {}
    referParams.condition = this.props.condition
    this.setState({
      params: referParams
    })
    this.getListData(referUrl, referParams, value + 1)
  }

  //点击tab事件
  handleTabClick = (value) => {
    if (value === '1') {
      YYPlusUtils.blueToothScan({
        isFilter: true,
        blueteeth: [{
          'sn': '1234567893',
          'id': 'a1234567894',
          'name': 'dev01',
          'code': 'a1234567894',
          'mac': '68:9E:19:03:AB:72',
        }, {
          'sn': '1234567894',
          'id': 'b1234567894',
          'name': 'dev02',
          'code': 'b1234567894',
          'mac': '68:9E:19:03:7F:5E',
        }]
      }, (result) => {
        alert(result)
      })
    } else if (value === '2') {
      YYPlusUtils.qrcodeScan('noDail', (result) => {
        alert(result)
      })
    }
  }

  //渲染list的选项
  renderListItem = (data, selectedId, displayField) => {
    return this.props.multiMode ? data.map(item => (
      <CheckboxItem key={item.id} onChange={() => this.onMultiChange(item)}>
        {item[displayField]}
      </CheckboxItem>
    )) : data.map(item => (
      <RadioItem key={item.id} checked={selectedId === item.id}
                 onChange={() => this.onSingleChange(item)}>
        {item[displayField]}
      </RadioItem>
    ))
  }

  render () {
    const {selectedId, data, pageNumber, pageCount, referName, animating, finish, loading} = this.state
    const {displayField, displayStyle, loaderDefaultIcon, loaderLoadingIcon} = this.props
    const tabTitle = ['参照', '蓝牙', '二维码']
    return (
      <div className="ss-refer-list">
        <SSNavBar leftContent="返回"
                  title={this.props.referName || referName}
                  key="nav"
                  onLeftClick={this.onClose}
                  rightContent={[
                    <a key="nav" onClick={this.onOk}>确定</a>,
                  ]}
        />
        {
          displayStyle == '2' ? null : <ActivityIndicator
            toast
            text="加载中..."
            animating={animating}
          />
        }
        <SearchBar placeholder="搜索" onSubmit={this.onSearchSubmit}/>
        <SSTab
          display="none"
          handleTabClick={this.handleTabClick}
          names={tabTitle}/>
        {displayStyle == '2' ? (<List className='referList-content'
                                      renderFooter={() => (
                                        <div style={{textAlign: 'center'}}>
                                          {finish ? loaderDefaultIcon : loading ? loaderLoadingIcon : false}
                                        </div>)}

        >
          {this.renderListItem(data, selectedId, displayField)}
        </List>) : (
          <List className='list-content'>
            {this.renderListItem(data, selectedId, displayField)}
          </List>
        )
        }

        {
          displayStyle == '2' ? null : (<div>
            <WhiteSpace/>
            <Pagination total={pageCount}
                        onChange={this.onChangePageNumber}
                        className="custom-pagination-with-icon"
                        current={pageCount > 0 ? pageNumber : -1}
                        locale={{
                          prevText: (<span
                            className="arrow-align">上一页</span>),
                          nextText: (<span
                            className="arrow-align">下一页</span>),
                        }}
            /></div>)
        }
      </div>
    )
  }
}

SSQBReferList.propTypes = {
  referName: PropTypes.string,
  referUrl: PropTypes.string,
  displayField: PropTypes.string,
  referParams: PropTypes.object,
  multiMode: PropTypes.bool,
}

SSQBReferList.defaultProps = {
  referName: '',
  referCode: '',
  displayField: 'name',
  referParams: {},
  multiMode: false,
  loaderLoadingIcon: <LoadMore loading> 加载中... </LoadMore>,
  loaderDefaultIcon: <LoadMore showLine> 无更多数据 </LoadMore>,
  triggerPercent: 95,
}

export default SSQBReferList
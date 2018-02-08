import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import ajax from '../../utils/ajax';
import {Accordion, Popup, Toast, SearchBar, Checkbox, ActivityIndicator, WhiteSpace} from 'antd-mobile/lib/index';
import '../../../css/SSReferTree.css'
import RestUrl from "../../common/RestUrl";
import SSNavBar from "../navbar/SSNavBar";
import {hashHistory} from 'react-router';





/*
* SSTree组件
* onOk       获取组件选择类型函数
* referCode  参照编码
* multiMode  选择单选多选
* onSearchText   搜索文本
*
* */

let page;
let CheckboxItem = Checkbox.CheckboxItem;
class SSReferTree extends Component {
  state = {
    data: [],
    selectedId: null,
    selectedNode: {},
    selectedNodes: [],
    animating: false
  }

  componentWillMount() {
    page = this;
    // window.addEventListener('hashchange', (hash) => {
    //   let oldUri = hash.oldURL.split('#/')[1].split('?')[0];
    //   if(oldUri.endsWith('/refer')){
    //       this.props.onClose();
    //   }
    // })
    window.addEventListener('backbutton', () => {
      let hash = window.location.hash.split('?')[0];
      if (hash.endsWith('/refer')) {
        this.props.onClose()
      }
    })
    let referCode = this.props.referCode;
    //根据参照编码获取参照信息
    ajax.getJSON(RestUrl.REF_SERVER_URL + RestUrl.GET_REFINFO_BYCODE, {refCode: referCode}, function (result) {
      if(result.success){
        let referUrl = result.data.dataurl;
        let referParams = {};
        page.setState({
          referUrl: referUrl
        })
        referParams.condition = page.props.condition;
        referParams.searchText = page.props.searchText;
        page.getTreeData(referUrl, referParams);
      }else{
        Toast.fail("请检查参照编码!", 1);
      }

    }, function (err) {
      Toast.fail("服务器通讯异常!", 1);
    })
  }
  componentWillReceiveProps(nextProps){
    if(JSON.stringify(nextProps)!==JSON.stringify(this.props)){
      let referUrl = this.state.referUrl;
      let referParams = {};
      referParams.searchText = nextProps.searchText;
      referParams.condition = nextProps.condition;
      this.getTreeData(referUrl, referParams);
    }
  }


  onChange = (value) => {

  }

  onSingleChange = (e, selectedNode) => {
    const {onChange} = this.props
    e.stopPropagation();
    e.preventDefault();
    if (selectedNode.id === this.state.selectedId) {
      onChange&&onChange({}) || ''
      this.setState({
        selectedId: null,
        selectedNode: {}
      });
    } else {
      onChange&&onChange(selectedNode) || ''
      this.setState({
        selectedId: selectedNode.id,
        selectedNode: selectedNode
      });
    }
  }

  onMultiChange = (e, selectedNode) => {
    const {onChange} = this.props
    e.stopPropagation();
    e.preventDefault();
    //多选模式
    let selectedNodes = this.state.selectedNodes;
    if (!selectedNodes.some((item) => {
        return item.id === selectedNode.id
      })) {
      selectedNodes.push(selectedNode);
      onChange&&onChange(selectedNodes) || ''
      this.setState({
        selectedNodes: selectedNodes
      });
    } else {
      let newNodes = [];
      // eslint-disable-next-line
      selectedNodes.map((item) => {
        if (item.id !== selectedNode.id) {
          newNodes.push(item);
        }
      })
      onChange&&onChange(newNodes) || ''
      this.setState({
        selectedNodes: newNodes
      });
    }
  }

  getTreeData = (referUrl, referParams) =>{
    this.setState({
      animating: true
    })
    ajax.getText(referUrl, referParams, function (result) {
      result = JSON.parse(result);
      page.setState({
        data: result,
        animating: false
      })
    }, function (err) {
      page.setState({
        animating: false
      })
      Toast.fail("服务器通讯异常!", 1);
    })
  }
  onSearchSubmit = (value) => {
    let referUrl = this.state.referUrl;
    let referParams = {};
    referParams.searchText = value;
    referParams.condition = this.props.condition;
    this.getTreeData(referUrl, referParams);
  }

  onOk = () => {
    if (this.props.onOk && _.isFunction(this.props.onOk)) {
      if (!this.props.multiMode) {
        this.props.onOk(this.state.selectedNode);
      } else {
        this.props.onOk(this.state.selectedNodes);
      }
    }
  }

  loop = (treeData, selectedId) => {
    if(!this.props.multiMode){
      return treeData.map((item) => {
        if (item.children && item.children.length > 0) {
          item.isLeaf = false;
          return <Accordion onChange={this.onChange} className="refer-accordion" key={item.id}><Accordion.Panel className="refer-pad" key={item.id} header={<CheckboxItem checked={selectedId === item.id} onChange={(e) => this.onSingleChange(e, item)} key={item.id}>{item[this.props.displayField]}</CheckboxItem>}>{this.loop(item.children, selectedId)}</Accordion.Panel></Accordion>;
        }else{
          item.isLeaf = true;
          return <CheckboxItem checked={selectedId === item.id} className="refer-check-box" onChange={(e) => this.onSingleChange(e, item)} key={item.id}>{item[this.props.displayField]}</CheckboxItem>;
        }
      });
    }else{
      return treeData.map((item) => {
        if (item.children && item.children.length > 0) {
          return <Accordion onChange={this.onChange} className="refer-accordion" key={item.id}><Accordion.Panel className="refer-pad" key={item.id} header={<CheckboxItem onChange={(e) => this.onMultiChange(e, item)} key={item.id}>{item[this.props.displayField]}</CheckboxItem>}>{this.loop(item.children, selectedId)}</Accordion.Panel></Accordion>;
        }else{
          return <CheckboxItem className="refer-check-box" onChange={(e) => this.onMultiChange(e, item)} key={item.id}>{item[this.props.displayField]}</CheckboxItem>;
        }
      });
    }
  }

  render() {
    const {data, selectedId,animating} = this.state;
    return (
      <div className="ss-refer-tree">
        <ActivityIndicator
          toast
          text="加载中..."
          animating={animating}
        />
        <WhiteSpace/>
        <div className="refer-tree-content">
          {this.loop(data, selectedId)}
        </div>
      </div>
    );
  }
}

SSReferTree.propTypes = {
  referCode: PropTypes.string,
  displayField: PropTypes.string,
  referParams: PropTypes.object,
  multiMode: PropTypes.bool,
  onChange:PropTypes.func,
};

SSReferTree.defaultProps = {
  referCode: '',
  referParams: {},
  multiMode: false,
  displayField: 'name',
};

export default SSReferTree;

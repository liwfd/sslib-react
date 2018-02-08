/**
 * @author liwfd
 * @template 2018-01-20
 */
import React, {Component} from 'react';
import {SwipeAction, List, Checkbox, Toast, SearchBar} from 'antd-mobile';
import _ from 'lodash';
import SSNavBar from "../navbar/SSNavBar";
import SSTab from "../tab/SSTab";
import ajax from "../../utils/ajax";
import '../../../css/SSNewRefer.css';
import RestUrl from "../../common/RestUrl";
import AuthToken from "../../utils/AuthToken";
import PropTypes from 'prop-types';
import {SSIcon} from "../../index";

const Item = List.Item;
const ADDR = RestUrl.ADDR;
let page;
export default class SSReferTree extends Component {
    state = {
        treeData: [],
        commonData: [],
        currentData: [],
        parentNode: null,
        selectedNodes: Array.isArray(this.props.value) ? this.props.value : (this.props.value ? [this.props.value] : []),
        title: '常用',
        referName: '',
        referUrl: ''
    }

    /**
     * 点击行左侧事件
     * @param e
     * @param item
     */
    leftClick = (e, item) => {
        e.stopPropagation();
        this.onCheck(item)();
    }

    /**
     * 点击行右侧穿透事件
     * @param item
     */
    onItemClick = item => () => {
        if (item.children && item.children.length > 0) {
            this.setState({
                currentData: item.children,
                parentNode: item,
                title: item.name
            })
        }
    }

    /**
     * 后退事件
     */
    backToParent = () => {
        if (!this.state.parentNode) {
            return;
        }
        const treeData = this.state.treeData;
        const loop = (data, parent) => {
            data.map((item, index, temp) => {
                if (item.id === this.state.parentNode.id) {
                    this.setState({
                        currentData: temp,
                        parentNode: parent,
                        title: parent ? parent.name : this.state.referName
                    })
                } else if (item.children && item.children.length > 0) {
                    loop(item.children, item);
                }
            })
        }
        loop(treeData);
    }

    /**
     * 取消/返回事件
     */
    onClose = () => {
        this.props.onClose();
    };

    /**
     * 确定事件
     */
    onOk = () => {
        if (this.props.onOk && _.isFunction(this.props.onOk)) {
            if (!this.props.multiMode) {
                this.props.onOk(this.state.selectedNodes[0] || {});
            } else {
                this.props.onOk(this.state.selectedNodes);
            }
        }
    }

    /**
    * 移除常用
    * @param item
    */
    deleteCommon = id => () => {
        ajax.getJSON(ADDR + '/icop-support-web/store/delete', {
            conditionly: '',
            refinfokey: this.props.referCode,
            userId: AuthToken.getUserId(),
            ids: id
        }, (result) => {
            if (result.success) {
                Toast.success('移除成功!', 1);
                this.setState({
                    commonData: result.backData.dataset
                })
            } else {
                Toast.fail(result.backMsg, 1);
            }
        })
    }

    /**
     * 设为常用
     * @param item
     */
    setCommonUse = item => () => {
        ajax.postJSON(ADDR + '/icop-support-web/store/save', {
                dataset: [{data: item, id: item.id}],
                oper: 0,
                refinfokey: this.props.referCode,
                userId: AuthToken.getUserId()
            },
            (result) => {
                if (result.success) {
                    Toast.success('设置常用成功!', 1);
                    this.setState({
                        commonData: result.backData.dataset
                    })
                } else {
                    Toast.fail(result.backMsg, 1);
                }
            }
        )
    }

    /**
     * 选中checkbox
     * @param item
     */
    onCheck = item => () => {
        if (this.props.onCheck && _.isFunction(this.props.onCheck)) {
            if (this.state.selectedNodes.some(temp => temp.id === item.id)) {
                this.props.onCheck(null);
            } else {
                this.props.onCheck(item);
            }
        }
        if (!this.props.multiMode) {
            if (this.state.selectedNodes[0] && this.state.selectedNodes[0].id === item.id) {
                this.setState({
                    selectedNodes: []
                })
            } else {
                this.setState({
                    selectedNodes: [item]
                })
            }
        } else {
            let index = null;
            if (this.state.selectedNodes.find((node, i) => {
                    index = i;
                    return node.id === item.id;
                })) {
                this.state.selectedNodes.splice(index, 1);
                this.setState({
                    selectedNodes: this.state.selectedNodes
                })
            } else {
                this.state.selectedNodes.push(item);
                this.setState({
                    selectedNodes: this.state.selectedNodes
                })
            }
        }
    }

    /** 切换tab事件
     * @param value
     */
    onTabChange = (value) => {
        if (!this.state.parentNode || value.sub === 0) {
            this.setState({
                title: value.title
            })
        } else {
            this.setState({
                title: this.state.parentNode.name
            })
        }
    }

    initCommonUse = () => {
        ajax.getJSON(ADDR + '/icop-support-web/store/showlist', {
                searchtext: null,
                conditionly: '',
                refinfokey: this.props.referCode,
                userId: AuthToken.getUserId()
            },
            (result) => {
                if (result.success) {
                    page.setState({
                        commonData: result.backData.dataset
                    })
                }
            }
        )
    }

    /**
     *
     * @param referUrl
     * @param referParams
     */
    initReferContent = (referUrl, referParams) => {
        ajax.getText(referUrl, referParams, function (result) {
            result = JSON.parse(result);
            if (result.success === false && result.backMsg) {
                Toast.fail(result.backMsg, 1);
            } else {
                page.setState({
                    treeData: result,
                    currentData: result
                })
            }
        })
    }

    /**
     * 渲染常用
     * @returns {*}
     */
    renderCommonUse = () => {
        if (!this.state.commonData || this.state.commonData.length === 0) {
            return (<center style={{lineHeight: '80vh'}}>暂无数据</center>);
        }
        return this.state.commonData.map(item => {
            return (<SwipeAction key={item.id}
                                 style={{backgroundColor: 'gray'}}
                                 autoClose
                                 right={[
                                     {
                                         text: '移除常用',
                                         onPress: this.deleteCommon(item.id),
                                         style: {backgroundColor: '#F4333C', color: 'white'},
                                     }
                                 ]}
            >
                <Item
                    style={{borderBottom: '1px solid #ddd'}}
                    multipleLine
                    onClick={this.onCheck(item.data)}
                >
                    <div style={{paddingLeft: '0.2rem'}}>
                        <Checkbox checked={this.state.selectedNodes.find(node => node.id === item.id)}>
                        <span style={{marginLeft: '0.2rem', verticalAlign: 'middle'}}>
                            {item.data.name}
                        </span>
                        </Checkbox>
                    </div>
                </Item>
            </SwipeAction>);
        });
    }

    /**
     * 渲染参照内容
     * @returns {Array}
     */
    renderContent = () => {
        const style = {
            width: '82vw',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        };
        return this.state.currentData.map(item => {
            return (<SwipeAction key={item.id}
                                 style={{backgroundColor: 'gray'}}
                                 autoClose
                                 right={item.selectable ? [
                                     {
                                         text: '设为常用',
                                         onPress: this.setCommonUse(item),
                                         style: {backgroundColor: '#108ee9', color: 'white'},
                                     }
                                 ] : []}
            >
                <Item
                    style={{borderBottom: '1px solid #ddd'}}
                    arrow={!item.children || item.children.length === 0 ? 'empty' : 'horizontal'}
                    extra={item.children ? item.children.length : 0}
                    multipleLine
                    onClick={this.onItemClick(item)}
                >
                    <div style={{width: '80vw', paddingLeft: '0.2rem', display: 'inline-block'}}
                         onClick={e => this.leftClick.call(this, e, item)}>
                        {
                            item.selectable ? (
                                <Checkbox checked={this.state.selectedNodes.find(node => node.id === item.id)}>
                                                        <span style={{
                                                            marginLeft: '0.2rem',
                                                            verticalAlign: 'middle'
                                                        }}>{item.name}</span>
                                </Checkbox>) : (<span style={{
                                marginLeft: '0.2rem',
                                verticalAlign: 'middle'
                            }}>{item.name}</span>)
                        }

                    </div>
                    <span style={{borderRight: '1px solid #ddd'}}></span>
                </Item>
            </SwipeAction>)
        })
    }

    componentWillMount() {
        page = this;
        window.addEventListener('backbutton', () => {
            let hash = window.location.hash.split('?')[0];
            if (hash.endsWith('/refer')) {
                this.onClose();
            }
        })
        //根据参照编码获取参照信息
        ajax.getJSON(RestUrl.REF_SERVER_URL + RestUrl.GET_REFINFO_BYCODE, {refCode: this.props.referCode}, function (result) {
            if(result.success){
                const referUrl = result.data.dataurl;
                const referParams = {};
                page.setState({
                    referName: result.data.refName,
                    referUrl: referUrl
                });
                if(!_.isEmpty(page.props.condition)){
                    referParams.condition = page.props.condition;
                }
                page.initReferContent(referUrl, referParams);
                page.initCommonUse();
            }else{
                Toast.fail("请检查参照编码!", 1);
            }

        }, function (err) {
            Toast.fail("服务器通讯异常!", 1);
        })
    }

    render() {
        return (
            <div className="refer-content">
                <SSNavBar onLeftClick={this.onClose} rightContent={<span onClick={this.onOk}>确定</span>}
                          title={this.state.title}/>
                <SSTab onChange={this.onTabChange} swipeable={false} defaultActiveKey={0} display="none"
                       names={['常用', '参照']}>
                    <div>
                        <List>{this.renderCommonUse()}</List>
                    </div>
                    <div>
                        <List>
                            <Item
                                style={{borderBottom: '1px solid #ddd'}}
                                multipleLine
                                onClick={this.backToParent}
                            >
                                <span style={{paddingLeft: '0.4rem'}}><SSIcon size='xxs' icon='icon-backtoparent'/></span>
                            </Item>
                            {
                                this.renderContent()
                            }
                        </List>
                    </div>
                </SSTab>
            </div>
        );
    }
}

SSReferTree.propTypes = {
    referName: PropTypes.string,
    referCode: PropTypes.string,
    displayField: PropTypes.string,
    referParams: PropTypes.object,
    multiMode: PropTypes.bool,
};

SSReferTree.defaultProps = {
    referName: '参照',
    referCode: '',
    referParams: {},
    multiMode: false,
    displayField: 'name',
};
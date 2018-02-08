/**
 * @author liwfd
 * @template 2018-01-20
 */
import React, {Component} from 'react';
import {SwipeAction, List, Checkbox, Toast, SearchBar, Drawer} from 'antd-mobile';
import SSNavBar from "../navbar/SSNavBar";
import SSTab from "../tab/SSTab";
import _ from 'lodash';
import ajax from "../../utils/ajax";
import '../../../css/SSNewRefer.css';
import RestUrl from "../../common/RestUrl";
import AuthToken from "../../utils/AuthToken";
import PropTypes from 'prop-types';
import SSList from "../list/SSList";
import {SSIcon} from "../../index";

const Item = List.Item;
const Brief = Item.Brief;
const ADDR = RestUrl.ADDR;
let page;
export default class SSReferTreeList extends Component {
    state = {
        treeData: [],
        listData: [],
        commonData: [],
        currentData: [],
        parentNode: null,
        selectedNodes: Array.isArray(this.props.value) ? this.props.value : (this.props.value ? [this.props.value] : []),
        title: '常用',
        referName: '',
        referUrl: '',
        open: false,
        head: {},
        header: [],
        referParams: {pageNumber: 1, pageSize: 20},
        listParams: {pageNumber: 1, pageSize: 20},
        selectedTreeNode: {},
        scrollHeight: 480
    }

    /**
     * 点击行左侧事件
     * @param e
     * @param item
     */
    leftClick = (e, item) => {
        e.stopPropagation();
        this.onOpenList(item);
    }

    /**
     *
     * @param item
     */
    onOpenList = item => {
        this.setState({
            open: !this.state.open
        })
        const listParams = {};
        listParams.relyCondition = (this.state.relyfield + '=' + item.id);
        if(!_.isEmpty(this.props.listCondition)){
            listParams.condition = this.props.listCondition;
        }
        listParams.pageNumber = 1;
        listParams.pageSize = 20;
        this.setState({
            listParams: listParams,
            selectedTreeNode: item
        })
        this.refs.referList && this.refs.referList.initData(this.state.referUrl, listParams);
    }

    onOpenChange = () => {
        this.setState({
            open: !this.state.open
        });
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

    /**
     * 常用列表初始化
     */
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
     * @param treeUrl
     * @param referParams
     */
    initTreeContent = (treeUrl, referParams) => {
        ajax.getText(treeUrl, referParams, function (result) {
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
        const style = {
            width: '82vw',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        };
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
                            <div onClick={e => e.preventDefault()} style={{marginLeft: '0.3rem', verticalAlign: 'middle', display: 'inline-block'}}>
                                <p style={style}>
                                    {item.data.name}
                                </p>
                                {this.renderExtra(item.data)}
                            </div>
                        </Checkbox>
                    </div>
                </Item>
            </SwipeAction>);
        });
    }

    /**
     * 渲染额外信息
     * @param item
     */
    renderExtra = item => {
        const style = {
            marginRight: '0.2rem',
            width: this.state.title === '常用' ? '82vw' : '66vw',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        };
        return this.props.extraFields.map(field => {
            if (!this.state.head) return;
            if (this.state.head[field]) {
                return (
                    <Brief key={field}>
                        <p style={style}>
                            <span style={{marginRight: '0.1rem'}}>{this.state.head[field]}:</span>
                            {item[field]}
                        </p>
                    </Brief>);
            } else {
                console.error('字段' + field + '不存在!');
            }
        });
    }

    /**
     * 渲染参照内容
     * @returns {*}
     */
    renderListContent = () => {
        const style = {
            marginRight: '0.2rem',
            width: '66vw',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        };
        if (!this.state.listData || this.state.listData.length === 0) {
            return (<center style={{lineHeight: '90vh', backgroundColor: '#f5f5f9'}}>暂无数据</center>);
        }
        return this.state.listData.map(item => {
            return (<SwipeAction key={item.id}
                                 style={{backgroundColor: 'gray'}}
                                 autoClose
                                 right={[
                                     {
                                         text: '设为常用',
                                         onPress: this.setCommonUse(item),
                                         style: {backgroundColor: '#108ee9', color: 'white'},
                                     }
                                 ]}
            >
                <Item
                    multipleLine
                    style={{borderBottom: '1px solid #ddd'}}
                    onClick={this.onCheck(item)}
                >
                    <div style={{paddingLeft: '0.2rem'}}>
                        <Checkbox checked={this.state.selectedNodes.find(node => node.id === item.id)}>
                            <div onClick={e => e.preventDefault()} style={{marginLeft: '0.3rem', verticalAlign: 'middle', display: 'inline-block'}}>
                                <p style={style}><span style={{marginRight: '0.2rem'}}>{this.state.head['name']}:</span>{item.name}
                                </p>
                                {this.renderExtra(item)}
                            </div>
                        </Checkbox>
                    </div>
                </Item>
            </SwipeAction>)
        })
    }

    /**
     * 加载更多
     * @param result
     */
    onLoadMore = (result) => {
        this.setState({
            listData: result
        })
    };

    /**
     * 初始化数据的回调
     * 作用：加载表头项信息
     * @param result
     */
    initData = (result) => {
        let head = {};
        if (result.header && result.header.length > 0) {
            result.header.map(item => {
                head[item.code] = item.name;
            })
        }
        const nodes = _.clone(this.state.selectedTreeNode)
        delete nodes.children;
        result.data.content.map(row => {
            row.treeInfo = nodes;
        })
        this.setState({
            listData: result.data.content || [],
            header: result.header,
            head: head
        })
    };

    /**
     * 搜索列表
     * @param value
     */
    searchList = value => {
        const listParams = _.assign({}, this.state.listParams, {searchText: value});
        this.refs.referList.initData(this.state.referUrl, listParams);
    }

    /**
     * 搜索树
     * @param value
     */
    searchTree = value => {
        debugger;
    }

    /**
     * 渲染参照列表
     * @returns {XML}
     */
    renderList = () => {
        return (<div style={{overflow: 'hidden'}}>
            <SearchBar placeholder='搜索' onSubmit={this.searchList}/>
            <SSList scrollerHeight={this.state.scrollHeight} ref='referList' referParams={this.state.listParams} ajaxType="getJSON" url={this.state.referUrl}
                    params={this.state.listParams} onLoadMore={this.onLoadMore} initData={this.initData}>
                {this.renderListContent()}
            </SSList>
        </div>);
    }

    /**
     * 渲染参照树
     * @returns {Array}
     */
    renderTree = () => {
        if (!this.state.currentData || !Array.isArray(this.state.currentData)) {
            return [];
        }
        return this.state.currentData.map(item => {
            return (<Item key={item.id}
                          arrow={!item.children || item.children.length === 0 ? 'empty' : 'horizontal'}
                          extra={item.children ? item.children.length : 0}
                          multipleLine
                          onClick={this.onItemClick(item)}
            >
                <div style={{width: '80vw', paddingLeft: '0.2rem', display: 'inline-block'}}
                     onClick={e => this.leftClick.call(this, e, item)}>
                            <span style={{
                                marginLeft: '0.2rem',
                                verticalAlign: 'middle'
                            }}>{item.name}</span>
                </div>
                <span style={{borderRight: '1px solid #ddd'}}></span>
            </Item>)
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
            if (result.success) {
                const treeUrl = result.data.treerelyurl;
                const dataurl = result.data.dataurl;
                const relyfield = result.data.relyfield;
                const referParams = {};
                const listParams = page.state.listParams;
                if(!_.isEmpty(page.props.treeCondition)){
                    referParams.condition = page.props.treeCondition;
                }
                listParams.relyCondition = (relyfield + '=' + null);//初始列表不展示数据
                page.setState({
                    referName: result.data.refName,
                    referUrl: dataurl,
                    treeUrl,
                    relyfield,
                    listParams: listParams
                });
                page.initTreeContent(treeUrl, referParams);
                page.initCommonUse();
            } else {

                Toast.fail("请检查参照编码!", 1);
            }

        }, function (err) {
            Toast.fail("服务器通讯异常!", 1);
        })
    }

    componentDidMount() {
        const height = document.documentElement.clientHeight - 190;
        this.setState({
            scrollHeight: height
        });
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
                        <Drawer
                            className="my-drawer"
                            style={{minHeight: document.documentElement.clientHeight - 133}}
                            contentStyle={{color: '#A6A6A6', textAlign: 'center'}}
                            sidebar={this.renderList()}
                            open={this.state.open}
                            onOpenChange={this.onOpenChange}
                        >
                            <List>
                                <Item
                                    style={{borderBottom: '1px solid #ddd'}}
                                    multipleLine
                                    onClick={this.backToParent}
                                >
                                    <span style={{paddingLeft: '0.4rem'}}><SSIcon size='xxs' icon='icon-backtoparent'/></span>
                                </Item>
                                {
                                    this.renderTree()
                                }
                            </List>
                        </Drawer>
                    </div>
                </SSTab>
            </div>
        );
    }
}

SSReferTreeList.propTypes = {
    referName: PropTypes.string,
    referCode: PropTypes.string,
    displayField: PropTypes.string,
    referParams: PropTypes.object,
    listParams: PropTypes.object,
    multiMode: PropTypes.bool,
    extraFields: PropTypes.any
};

SSReferTreeList.defaultProps = {
    referName: '参照',
    referCode: '',
    referParams: {},
    listParams: {},
    multiMode: false,
    displayField: 'name',
    extraFields: []
};
/**
 * @author liwfd
 * @template 2018-01-20
 */
import React, {Component} from 'react';
import {SwipeAction, List, Checkbox, Toast, SearchBar} from 'antd-mobile';
import SSNavBar from "../navbar/SSNavBar";
import SSTab from "../tab/SSTab";
import ajax from "../../utils/ajax";
import '../../../css/SSNewRefer.css';
import RestUrl from "../../common/RestUrl";
import AuthToken from "../../utils/AuthToken";
import PropTypes from 'prop-types';
import _ from 'lodash';
import SSList from "../list/SSList";

const Item = List.Item;
const Brief = Item.Brief;
const ADDR = RestUrl.ADDR;
let page;

export default class SSReferList extends Component {

    state = {
        listData: [],
        commonData: [],
        selectedNodes: Array.isArray(this.props.value) ? this.props.value : (this.props.value ? [this.props.value] : []),
        referName: '参照',
        referUrl: '',
        header: [],
        scrollHeight: 500
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

    /**
     * 初始化常用数据
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
            width: '82vw',
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
     * @returns {Array}
     */
    renderContent = () => {
        const style = {
            width: '82vw',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        };
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
                    style={{borderBottom: '1px solid #ddd'}}
                    multipleLine
                    onClick={this.onCheck(item)}
                >
                    <div style={{paddingLeft: '0.2rem'}}>
                        <Checkbox checked={this.state.selectedNodes.find(node => node.id === item.id)}>
                            <div onClick={e => e.preventDefault()} style={{marginLeft: '0.3rem', verticalAlign: 'middle', display: 'inline-block'}}>
                                <p style={style}><span
                                    style={{marginRight: '0.2rem'}}>{this.state.head['name']}:</span>{item.name}
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
     * @param result
     */
    initData = (result) => {
        let head = {};
        if (result.header && result.header.length > 0) {
            result.header.map(item => {
                head[item.code] = item.name;
            })
        }
        this.setState({
            listData: result.data.content || [],
            header: result.header,
            head: head
        })
    };

    /**
     * 搜索
     * @param value
     */
    search = value => {
        const referParams = _.assign({}, this.state.referParams, {searchText: value});
        this.refs.referList.initData(this.state.referUrl, referParams);
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
                const referUrl = result.data.dataurl;
                const referParams = {};
                if (!_.isEmpty(page.props.condition)) {
                    referParams.condition = page.props.condition;
                }
                referParams.pageNumber = 1;
                referParams.pageSize = 20;
                page.setState({
                    referName: result.data.refName,
                    referUrl,
                    referParams: referParams
                })
                page.refs.referList.initData(referUrl, referParams);
                page.initCommonUse();
            } else {
                Toast.fail("请检查参照编码!", 1);
            }

        }, function (err) {
            Toast.fail("服务器通讯异常!", 1);
        })
    }

    componentDidMount() {
        const height = document.documentElement.clientHeight - 140;
        this.setState({
            scrollHeight: height
        });
    }

    render() {
        const {referUrl, referParams} = this.state;
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
                        <SearchBar placeholder='搜索' onSubmit={this.search}/>
                        <SSList scrollerHeight={this.state.scrollHeight} ref='referList' ajaxType="getJSON"
                                url={referUrl} params={referParams}
                                onLoadMore={this.onLoadMore} initData={this.initData}>
                            {this.renderContent()}
                        </SSList>
                    </div>
                </SSTab>
            </div>
        );
    }
}

SSReferList.propTypes = {
    referName: PropTypes.string,
    referCode: PropTypes.string,
    displayField: PropTypes.string,
    referParams: PropTypes.object,
    multiMode: PropTypes.bool,
    extraFields: PropTypes.any
};

SSReferList.defaultProps = {
    referName: '',
    referCode: '',
    referParams: {},
    multiMode: false,
    displayField: 'name',
    extraFields: []
};